import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import TextInputField from '@/components/TextInputField';
import SubmitButton from '@/components/SubmitButton';
import { SportsmanSearchItem } from '@/model/Sportsman';
import { fetchAthletes } from '@/services/apiService';
import { useAthleteContext } from '@/contexts/AthleteContext';
import { router } from 'expo-router';

interface SearchState {
  query: string;
  results: SportsmanSearchItem[];
  currentPage: number;
  isLoading: boolean;
  hasSearched: boolean;
  hasMorePages: boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export default function SearchAthlete() {
  const { setAthleteId, clearAthleteId } = useAthleteContext();
  
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    currentPage: 1,
    isLoading: false,
    hasSearched: false,
    hasMorePages: true,
  });

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoadRef = useRef(true);

  // Load initial athletes on component mount
  useEffect(() => {
    loadInitialAthletes();
  }, []);

  const loadInitialAthletes = useCallback(async () => {
    setSearchState(prev => ({ ...prev, isLoading: true, results: [], currentPage: 1, hasMorePages: true, hasSearched: false }));
    isInitialLoadRef.current = true;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const athletes = await fetchAthletes(1, 10);
        setSearchState(prev => ({
          ...prev,
          results: athletes.items,
          currentPage: 1,
          isLoading: false,
          hasMorePages: athletes.totalItems > athletes.items.length,
        }));
        isInitialLoadRef.current = false;
        return; // Success
      } catch (error) {
        console.error(`Failed to load initial athletes (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          // All retries failed
          setSearchState(prev => ({ ...prev, isLoading: false, results: [], hasMorePages: false }));
          isInitialLoadRef.current = false;
        }
      }
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      await loadInitialAthletes(); // This will use its own retry logic
      return;
    }

    setSearchState(prev => ({ ...prev, isLoading: true, query: trimmedQuery, results: [], currentPage: 1, hasSearched: true, hasMorePages: true }));

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const results = await fetchAthletes(1, 10, trimmedQuery);
        setSearchState(prev => ({
          ...prev,
          results: results.items,
          currentPage: 1,
          isLoading: false,
          hasMorePages: results.totalItems > results.items.length,
        }));
        return; // Success
      } catch (error) {
        console.error(`Search failed for query "${trimmedQuery}" (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          // All retries failed
          setSearchState(prev => ({ ...prev, isLoading: false, results: [], hasMorePages: false }));
        }
      }
    }
  }, [loadInitialAthletes]);

  // Handle search input changes with debounce
  const handleQueryChange = useCallback((text: string) => {
    setSearchState(prev => ({ ...prev, query: text }));
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Skip search during initial load
    if (isInitialLoadRef.current) {
      return;
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(text);
    }, 300);
  }, [handleSearch]);

  const loadMoreResults = async () => {
    if (searchState.isLoading || !searchState.hasMorePages) return;

    const nextPage = searchState.currentPage + 1;
    setSearchState(prev => ({ ...prev, isLoading: true }));

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const newResults = searchState.hasSearched
          ? await fetchAthletes(nextPage, 10, searchState.query.trim())
          : await fetchAthletes(nextPage, 10);

        setSearchState(prev => ({
          ...prev,
          results: [...prev.results, ...newResults.items],
          currentPage: nextPage,
          isLoading: false,
          hasMorePages: prev.results.length + newResults.items.length < newResults.totalItems,
        }));
        return; // Success
      } catch (error) {
        console.error(`Failed to load more results (page ${nextPage}, attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          // All retries failed
          setSearchState(prev => ({ ...prev, isLoading: false, hasMorePages: false })); // Stop trying to load more if all retries fail
        }
      }
    }
  };

  const formatDate = (isoDateString: string) => {
    try {
      return new Date(isoDateString).toLocaleDateString('ru-RU');
    } catch {
      return isoDateString;
    }
  };

  const handleAthletePress = (item: SportsmanSearchItem) => {
    setAthleteId(item.id);
    router.push("/(athlete)/athlete-info");
  }

  const renderAthleteItem = ({ item }: { item: SportsmanSearchItem }) => (
    <Pressable style={styles.athleteItem} onPress={() => handleAthletePress(item)}>
      <View style={styles.athleteInfo}>
        <Text style={styles.athleteName}>{item.fullName}</Text>
        <Text style={styles.athleteDetails}>
          Дата рождения: {formatDate(item.birthDate)}
        </Text>
        <Text style={styles.athleteId}>ID: {item.id}</Text>
      </View>
    </Pressable>
  );

  const renderFooter = () => {
    if (!searchState.hasMorePages) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Больше результатов нет</Text>
        </View>
      );
    }

    if (searchState.isLoading) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Загрузка...</Text>
        </View>
      );
    }

    return (
      <View style={styles.footerContainer}>
        <SubmitButton
          text="Загрузить еще"
          onPress={loadMoreResults}
          style={styles.loadMoreButton}
        />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchState.hasSearched 
          ? 'Спортсмены не найдены' 
          : 'Загрузка спортсменов...'}
      </Text>
    </View>
  );

  const renderHeader = useCallback(() => (
    <View style={styles.resultsHeaderContainer}>
      {/* Results Header */}
      <Text style={styles.resultsHeader}>
        {searchState.hasSearched 
          ? `Результаты поиска`
          : `Все спортсмены`}
      </Text>
    </View>
  ), [searchState.hasSearched]);

  const handleCreateAthlete = () => {
    clearAthleteId();
    router.push("/(athlete)/athlete-info");
  };

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchSectionContainer}>
        <View style={styles.inputField}>
          <TextInputField
            label="Поиск спортсмена"
            placeholder="Введите ФИО для поиска"
            value={searchState.query}
            onChangeText={handleQueryChange}
            returnKeyType="done"
          />
        </View>
        <SubmitButton
          text="Создать нового спортсмена"
          onPress={handleCreateAthlete}
          style={styles.createAthleteButton}
        />
      </View>

      <FlatList
        data={searchState.results}
        renderItem={renderAthleteItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreResults}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchSectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10, // Added to create some space before the list header
  },
  inputField: {
    width: "100%",
    marginBottom: 10, // Adjusted from 20
  },
  createAthleteButton: {
    width: "100%",
    marginTop: 10,
  },
  resultsHeaderContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    // paddingTop: 20, // Removed as search section now handles top padding
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 15,
    width: "100%",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  athleteItem: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  athleteInfo: {
    width: "100%",
  },
  athleteName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 5,
  },
  athleteDetails: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 3,
  },
  athleteId: {
    fontSize: 12,
    color: "#999999",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
  },
  footerText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  loadMoreButton: {
    width: "80%",
  },
  emptyContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});