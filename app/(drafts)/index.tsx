import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImmediateAssessments, updateImmediateAssessment, deleteImmediateAssessment, deleteAllImmediateAssessments } from '@/services/immediateAssessmentStorageService';
import { getMedicalOfficeAssessments, updateMedicalOfficeAssessment, deleteMedicalOfficeAssessment, deleteAllMedicalOfficeAssessments } from '@/services/medicalOfficeAssessmentStorageService';
import { ImmediateAssessment } from '@/model/ImmediateAssessment';
import { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import { SportsmanSearchItem } from '@/model/Sportsman';
import AthleteSelectionModal from '@/components/AthleteSelectionModal';
import SubmitButton from '@/components/SubmitButton';
import { useAuth } from '@/context/AuthContext';
import { sendImmediateAssessment, sendMedicalOfficeAssessment } from '@/services/apiService';

type Draft = Partial<ImmediateAssessment> | Partial<MedicalOfficeAssessment>;

export default function TestingFormScreen() {
    const [immediateDrafts, setImmediateDrafts] = useState<Partial<ImmediateAssessment>[]>([]);
    const [medicalOfficeDrafts, setMedicalOfficeDrafts] = useState<Partial<MedicalOfficeAssessment>[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isUserLoggedIn } = useAuth();

    const fetchDrafts = useCallback(async () => {
        setLoading(true);
        try {
            const immediate = await getImmediateAssessments();
            const medical = await getMedicalOfficeAssessments();
            console.log('Fetched immediate drafts:', immediate);
            console.log('Fetched medical office drafts:', medical);
            setImmediateDrafts(immediate);
            setMedicalOfficeDrafts(medical);
        } catch (error) {
            console.error("Failed to fetch drafts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrafts();
    }, [fetchDrafts]);

    const handleAthleteSelect = async (athlete: SportsmanSearchItem) => {
        if (selectedDraft) {
            console.log('Selected draft for update:', selectedDraft);
            console.log('Selected athlete:', athlete);
            
            const updatedDraft = { ...selectedDraft, sportsmanId: athlete.id };
            console.log('Updated draft:', updatedDraft);
            
            try {
                if ('observableSigns' in selectedDraft) {
                    // It's an ImmediateAssessment
                    console.log('Updating immediate assessment...');
                    await updateImmediateAssessment(updatedDraft as Partial<ImmediateAssessment>);
                    setImmediateDrafts(prevDrafts => {
                        console.log('Previous immediate drafts:', prevDrafts);
                        const selectedIndex = prevDrafts.findIndex(draft => {
                            // If both have IDs, compare by ID
                            if (draft.id !== undefined && selectedDraft.id !== undefined) {
                                return draft.id === selectedDraft.id;
                            }
                            // Otherwise compare by reference (same object)
                            return draft === selectedDraft;
                        });
                        console.log('Found selectedIndex:', selectedIndex);
                        
                        if (selectedIndex !== -1) {
                            const newDrafts = [...prevDrafts];
                            newDrafts[selectedIndex] = updatedDraft as Partial<ImmediateAssessment>;
                            console.log('New immediate drafts:', newDrafts);
                            return newDrafts;
                        }
                        console.log('Draft not found, returning original drafts');
                        return prevDrafts;
                    });
                } else {
                    // It's a MedicalOfficeAssessment
                    console.log('Updating medical office assessment...');
                    await updateMedicalOfficeAssessment(updatedDraft as Partial<MedicalOfficeAssessment>);
                    setMedicalOfficeDrafts(prevDrafts => {
                        console.log('Previous medical office drafts:', prevDrafts);
                        const selectedIndex = prevDrafts.findIndex(draft => {
                            // If both have IDs, compare by ID
                            if (draft.id !== undefined && selectedDraft.id !== undefined) {
                                return draft.id === selectedDraft.id;
                            }
                            // Otherwise compare by reference (same object)
                            return draft === selectedDraft;
                        });
                        console.log('Found selectedIndex:', selectedIndex);
                        
                        if (selectedIndex !== -1) {
                            const newDrafts = [...prevDrafts];
                            newDrafts[selectedIndex] = updatedDraft as Partial<MedicalOfficeAssessment>;
                            console.log('New medical office drafts:', newDrafts);
                            return newDrafts;
                        }
                        console.log('Draft not found, returning original drafts');
                        return prevDrafts;
                    });
                }
                setIsModalVisible(false);
                setSelectedDraft(null);
            } catch (error) {
                console.error('Failed to save draft:', error);
                // TODO: Show error message to user
            }
        }
    };

    const handleSubmitDraft = async (draft: Draft) => {
        if (!isUserLoggedIn || !draft.sportsmanId) {
            Alert.alert('Ошибка', 'Необходимо выбрать спортсмена перед отправкой');
            return;
        }

        try {
            if ('observableSigns' in draft) {
                // It's an ImmediateAssessment - cast to complete object
                const immediateAssessment = draft as Partial<ImmediateAssessment>;
                
                const completeAssessment: ImmediateAssessment = {
                    id: immediateAssessment.id,
                    sportsmanId: immediateAssessment.sportsmanId!,
                    startDate: immediateAssessment.startDate!,
                    endDate: immediateAssessment.endDate!,
                    observableSigns: immediateAssessment.observableSigns!,
                    neckSpineAssessment: immediateAssessment.neckSpineAssessment!,
                    glasgowScale: immediateAssessment.glasgowScale!,
                    coordinationEyeMovement: immediateAssessment.coordinationEyeMovement!,
                    maddocksQuestions: immediateAssessment.maddocksQuestions!,
                };
                
                console.log('Submitting immediate assessment:', completeAssessment);
                await sendImmediateAssessment(completeAssessment);
                
                // Remove from local storage after successful submission
                await deleteImmediateAssessment(draft.id as number);
                setImmediateDrafts(prevDrafts => prevDrafts.filter(d => d.id !== draft.id));
                
                Alert.alert('Успех', 'Базовое тестирование успешно отправлено на сервер');
            } else {
                // It's a MedicalOfficeAssessment - cast to complete object
                const medicalAssessment = draft as Partial<MedicalOfficeAssessment>;
                
                // Validate required fields
                if (!medicalAssessment.sportsmanId) {
                    Alert.alert('Ошибка', 'Необходимо выбрать спортсмена');
                    return;
                }
                
                const completeAssessment: MedicalOfficeAssessment = {
                    id: medicalAssessment.id,
                    sportsmanId: medicalAssessment.sportsmanId,
                    symptoms: medicalAssessment.symptoms,
                    orientationAssessment: medicalAssessment.orientationAssessment,
                    cognitiveFunctions: medicalAssessment.cognitiveFunctions,
                    shortTermMemory: medicalAssessment.shortTermMemory,
                    concentrationNumbers: medicalAssessment.concentrationNumbers,
                    concentrationMonths: medicalAssessment.concentrationMonths,
                    mbessInfo: medicalAssessment.mbessInfo,
                    mbessTestResults: medicalAssessment.mbessTestResults,
                    tandemWalkIsolatedTask: medicalAssessment.tandemWalkIsolatedTask,
                    tandemWalkDualTask: medicalAssessment.tandemWalkDualTask,
                    tandemWalkResult: medicalAssessment.tandemWalkResult,
                    deferredMemory: medicalAssessment.deferredMemory,
                    wasKnownBefore: medicalAssessment.wasKnownBefore,
                    differsFromKnownBefore: medicalAssessment.differsFromKnownBefore,
                };
                
                console.log('Submitting medical office assessment:', completeAssessment);
                await sendMedicalOfficeAssessment(completeAssessment);
                
                // Remove from local storage after successful submission
                await deleteMedicalOfficeAssessment(draft.id as string);
                setMedicalOfficeDrafts(prevDrafts => prevDrafts.filter(d => d.id !== draft.id));
                
                Alert.alert('Успех', 'Тестирование после травмы успешно отправлено на сервер');
            }
        } catch (error) {
            console.error('Error submitting draft:', error);
            Alert.alert('Ошибка', 'Не удалось отправить форму на сервер. Проверьте подключение к интернету.');
        }
    };

    const handleDeleteDraft = async (draft: Draft) => {
        if (!isUserLoggedIn || !draft.id) return;
        
        try {
            let deleted = false;
            if ('observableSigns' in draft) {
                // It's an ImmediateAssessment
                deleted = await deleteImmediateAssessment(draft.id as number);
                if (deleted) {
                    setImmediateDrafts(prevDrafts => prevDrafts.filter(d => d.id !== draft.id));
                }
            } else {
                // It's a MedicalOfficeAssessment
                deleted = await deleteMedicalOfficeAssessment(draft.id as string);
                if (deleted) {
                    setMedicalOfficeDrafts(prevDrafts => prevDrafts.filter(d => d.id !== draft.id));
                }
            }
            
            if (!deleted) {
                console.error('Failed to delete draft');
                // TODO: Show error message to user
            }
        } catch (error) {
            console.error('Error deleting draft:', error);
            // TODO: Show error message to user
        }
    };

    const handleDeleteAllDrafts = () => {
        if (!isUserLoggedIn) return;
        
        Alert.alert(
            'Удалить все формы?',
            'Все сохраненные формы будут безвозвратно удалены. Это действие нельзя отменить.',
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const [immediateDeleted, medicalDeleted] = await Promise.all([
                                deleteAllImmediateAssessments(),
                                deleteAllMedicalOfficeAssessments()
                            ]);
                            
                            if (immediateDeleted && medicalDeleted) {
                                setImmediateDrafts([]);
                                setMedicalOfficeDrafts([]);
                                console.log('All drafts deleted successfully');
                            } else {
                                console.error('Failed to delete some drafts');
                                Alert.alert('Ошибка', 'Не удалось удалить некоторые формы');
                            }
                        } catch (error) {
                            console.error('Error deleting all drafts:', error);
                            Alert.alert('Ошибка', 'Произошла ошибка при удалении форм');
                        }
                    },
                },
            ]
        );
    };

    const handleSelectAthlete = (draft: Draft) => {
        if (!isUserLoggedIn) return;
        setSelectedDraft(draft);
        setIsModalVisible(true);
    };

    const renderDraftCard = (item: Draft, idx: number) => {
        const draftId = 'observableSigns' in item 
            ? `immediate-${item.id || idx}` 
            : `medical-${item.id || idx}`;
            
        return (
            <View style={styles.athleteItem} key={draftId}>
                <View style={styles.rowBetween}>
                    {item.sportsmanId ? (
                        <Text style={styles.athleteId}>ID спортсмена: {item.sportsmanId}</Text>
                    ) : (
                        <Text style={styles.athleteId}>ID спортсмена: Не указан</Text>
                    )}
                    <View style={styles.draftBadge}>
                        <Text style={styles.draftBadgeText}>Черновик</Text>
                    </View>
                </View>
                {isUserLoggedIn && (
                    <View style={styles.actionsContainer}>
                        <View style={styles.buttonRow}>
                            {!item.sportsmanId ? (
                                <SubmitButton
                                    text="Выбрать спортсмена"
                                    onPress={() => handleSelectAthlete(item)}
                                    style={styles.primaryButton}
                                />
                            ) : (
                                <SubmitButton
                                    text="Отправить на сервер"
                                    onPress={() => handleSubmitDraft(item)}
                                    style={styles.primaryButton}
                                />
                            )}
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteDraft(item)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                                <Text style={styles.deleteButtonText}>Удалить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    if (loading && !immediateDrafts.length && !medicalOfficeDrafts.length) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            <View style={styles.headerActions}>
                <Text style={styles.mainTitle}>Сохраненные формы</Text>
                <View style={styles.headerButtons}>
                    {isUserLoggedIn && (immediateDrafts.length > 0 || medicalOfficeDrafts.length > 0) && (
                        <TouchableOpacity 
                            onPress={handleDeleteAllDrafts} 
                            style={styles.deleteAllButton}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                            <Text style={styles.deleteAllButtonText}>Удалить все</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={fetchDrafts} disabled={loading} style={styles.refreshIconContainer}>
                        <Ionicons name="refresh-circle-outline" size={28} color={loading ? '#ccc' : '#007AFF'} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.listTitle}>Базовые тестирования</Text>
            <FlatList
                data={immediateDrafts}
                keyExtractor={(item, idx) => `immediate-${item.id || idx}`}
                renderItem={({ item, index }) => renderDraftCard(item, index)}
                ListEmptyComponent={<Text style={{ color: 'gray', marginLeft: 8 }}>Нет драфтов</Text>}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
            <Text style={styles.listTitle}>Тестирования после травмы</Text>
            <FlatList
                data={medicalOfficeDrafts}
                keyExtractor={(item, idx) => `medical-${item.id || idx}`}
                renderItem={({ item, index }) => renderDraftCard(item, index)}
                ListEmptyComponent={<Text style={{ color: 'gray', marginLeft: 8 }}>Нет драфтов</Text>}
                contentContainerStyle={{ paddingBottom: 16 }}
            />

            <AthleteSelectionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelect={handleAthleteSelect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    mainTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    refreshIconContainer: {
        padding: 5,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    deleteAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: '#FFE6E6',
    },
    deleteAllButtonText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 12,
    },
    listTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    athleteItem: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 0,
    },
    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    draftBadge: {
        backgroundColor: '#FFE082',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        minWidth: 60,
        alignItems: 'center',
        marginLeft: 8,
    },
    draftBadgeText: {
        color: '#8D6E63',
        fontWeight: 'bold',
        fontSize: 12,
    },
    athleteId: {
        fontSize: 14,
        color: '#999999',
        flexShrink: 1,
    },
    actionsContainer: {
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    primaryButton: {
        flex: 1,
        minWidth: '60%',
    },
    deleteButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        minWidth: 90,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});