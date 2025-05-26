import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, Pressable } from 'react-native';
import { SportsmanSearchItem } from '@/model/Sportsman';
import { fetchAthletes } from '@/services/apiService';
import TextInputField from './TextInputField';
import SubmitButton from './SubmitButton';

interface AthleteSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (athlete: SportsmanSearchItem) => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export default function AthleteSelectionModal({ visible, onClose, onSelect }: AthleteSelectionModalProps) {
    const [searchState, setSearchState] = useState({
        query: '',
        results: [] as SportsmanSearchItem[],
        currentPage: 1,
        isLoading: false,
        hasSearched: false,
        hasMorePages: true,
    });

    const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialLoadRef = React.useRef(true);

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
                return;
            } catch (error) {
                console.error(`Failed to load initial athletes (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                } else {
                    setSearchState(prev => ({ ...prev, isLoading: false, results: [], hasMorePages: false }));
                    isInitialLoadRef.current = false;
                }
            }
        }
    }, []);

    useEffect(() => {
        if (visible) {
            loadInitialAthletes();
        }
    }, [visible, loadInitialAthletes]);

    const handleSearch = useCallback(async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            await loadInitialAthletes();
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
                return;
            } catch (error) {
                console.error(`Search failed for query "${trimmedQuery}" (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                } else {
                    setSearchState(prev => ({ ...prev, isLoading: false, results: [], hasMorePages: false }));
                }
            }
        }
    }, [loadInitialAthletes]);

    const handleQueryChange = useCallback((text: string) => {
        setSearchState(prev => ({ ...prev, query: text }));
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (isInitialLoadRef.current) {
            return;
        }

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
                return;
            } catch (error) {
                console.error(`Failed to load more results (page ${nextPage}, attempt ${attempt + 1}/${MAX_RETRIES + 1}):`, error);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                } else {
                    setSearchState(prev => ({ ...prev, isLoading: false, hasMorePages: false }));
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

    const renderAthleteItem = ({ item }: { item: SportsmanSearchItem }) => (
        <Pressable 
            style={styles.athleteItem} 
            onPress={() => {
                onSelect(item);
                onClose();
            }}
        >
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

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Выберите спортсмена</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </Pressable>
                    </View>

                    <View style={styles.searchContainer}>
                        <TextInputField
                            label="Поиск спортсмена"
                            placeholder="Введите ФИО для поиска"
                            value={searchState.query}
                            onChangeText={handleQueryChange}
                            returnKeyType="done"
                        />
                    </View>

                    <FlatList
                        data={searchState.results}
                        renderItem={renderAthleteItem}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    {searchState.hasSearched 
                                        ? 'Спортсмены не найдены' 
                                        : 'Загрузка спортсменов...'}
                                </Text>
                            </View>
                        }
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreResults}
                        onEndReachedThreshold={0.1}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatListContent}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 20,
        color: '#666',
    },
    searchContainer: {
        marginBottom: 16,
    },
    flatListContent: {
        paddingBottom: 16,
    },
    athleteItem: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    athleteInfo: {
        width: '100%',
    },
    athleteName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 5,
    },
    athleteDetails: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 3,
    },
    athleteId: {
        fontSize: 12,
        color: '#999999',
    },
    footerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
    },
    footerText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    loadMoreButton: {
        width: '80%',
    },
    emptyContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
}); 