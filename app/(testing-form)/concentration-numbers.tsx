import React, { useState, useEffect } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

// DIGIT_LISTS[listKey][rowIndex][attemptIndex]
const DIGIT_LISTS = {
    A: [
        ['4-9-3', '6-2-9'], // Row 0 (3 digits)
        ['3-8-1-4', '3-2-7-9'], // Row 1 (4 digits)
        ['6-2-9-7-1', '1-5-2-8-6'], // Row 2 (5 digits)
        ['7-1-8-4-6-2', '5-3-9-1-4-8'], // Row 3 (6 digits)
    ],
    B: [
        ['5-2-6', '4-1-5'],
        ['1-7-9-5', '4-9-6-8'],
        ['4-8-5-2-7', '6-1-8-4-3'],
        ['8-3-1-9-6-4', '7-2-4-8-5-6'],
    ],
    V: [
        ['1-4-2', '6-5-8'],
        ['6-8-3-1', '3-4-8-1'],
        ['4-9-1-5-3', '6-8-2-5-1'],
        ['3-7-6-5-1-9', '9-2-6-5-1-4'],
    ],
};

type ListKey = keyof typeof DIGIT_LISTS;
type Step = 'instruction' | 'testing';

export default function ConcentrationNumbers() {
    const { updateConcentrationNumbers } = useFormContext();

    const [currentStep, setCurrentStep] = useState<Step>('instruction');
    const [selectedList, setSelectedList] = useState<ListKey>('A');
    
    const [activeRow, setActiveRow] = useState(0); // Index for the current difficulty level/row
    const [attemptNumber, setAttemptNumber] = useState(0); // 0 for 1st string in pair, 1 for 2nd
    const [score, setScore] = useState(0);
    const [isTestComplete, setIsTestComplete] = useState(false);

    const resetTestState = () => {
        setActiveRow(0);
        setAttemptNumber(0);
        setScore(0);
        setIsTestComplete(false);
    };

    // Reset test progress if list changes during testing phase (though UI primarily changes list on instruction screen)
    useEffect(() => {
        resetTestState();
    }, [selectedList]);

    const handleListChange = (itemValue: string | number) => {
        const newList = String(itemValue) as ListKey;
        setSelectedList(newList);
        // useEffect will call resetTestState
    };

    const proceedToTesting = () => {
        resetTestState(); // Ensure fresh start when moving from instructions
        setCurrentStep('testing');
    };

    const handleAttempt = (wasSuccessful: boolean) => {
        if (isTestComplete) return;

        let nextActiveRow = activeRow;
        let nextAttemptNumber = attemptNumber;
        let newScore = score;

        if (wasSuccessful) {
            newScore++;
            nextActiveRow++;
            nextAttemptNumber = 0;
        } else {
            if (attemptNumber === 0) { // Failed first attempt of the pair
                nextAttemptNumber = 1;
                // Stay on the same activeRow
            } else { // Failed second attempt of the pair
                nextActiveRow++;
                nextAttemptNumber = 0;
                // Score not incremented for this row
            }
        }
        
        setScore(newScore);
        setActiveRow(nextActiveRow);
        setAttemptNumber(nextAttemptNumber);

        if (nextActiveRow >= DIGIT_LISTS[selectedList].length) {
            setIsTestComplete(true);
        }
    };

    const handleSubmit = () => {
        const dataToSave: MedicalOfficeAssessment.ConcentrationNumbers = {
            numberList: selectedList,
            score: score, 
        };
        updateConcentrationNumbers(dataToSave);
        router.push('/(testing-form)/concentration-months');
    };

    const handleResetConfirmation = () => {
        Alert.alert(
            "Сбросить тест?",
            "Вы уверены, что хотите сбросить текущий прогресс и начать заново с выбора списка?",
            [
                { text: "Отмена", style: "cancel" },
                {
                    text: "Сбросить",
                    onPress: () => {
                        resetTestState();
                        setCurrentStep('instruction');
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const renderInstructionStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.header}>Повторение цифр в обратном порядке</Text>
            <Text style={styles.instructionText}>
                Выберите список цифр для тестирования. Скорость тестирования составляет одну цифру в секунду. Читайте цепочки цифр из выбранного списка сверху вниз.
            </Text>
            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Список цифр:</Text>
                <Picker
                    selectedValue={selectedList}
                    onValueChange={handleListChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="A" value="A" />
                    <Picker.Item label="B" value="B" />
                    <Picker.Item label="C" value="V" />
                </Picker>
            </View>
            <SubmitButton text="Начать тестирование" onPress={proceedToTesting} style={styles.actionButton} />
        </View>
    );

    const renderTestingStep = () => {
        const currentDigits = !isTestComplete ? DIGIT_LISTS[selectedList][activeRow][attemptNumber] : "Тест завершен";

        return (
            <View style={styles.stepContainer}>
                <Text style={[styles.instructionText, styles.italicInstruction]}>
                    Скажите: "Я собираюсь прочитать последовательность чисел, и когда я закончу, вы повторите их мне в порядке, обратном тому, как я прочитал их вам. Например, если я скажу 7-1-9, вы скажете 9-1-7. Итак, если бы я сказал 9-6-8, вы бы ответили? (8-6-9)"
                </Text>
                
                {!isTestComplete ? (
                    <View style={styles.testingContent}>
                        <Text style={styles.digitStringDisplay}>{currentDigits}</Text>
                        <View style={styles.attemptButtonsContainer}>
                            <SubmitButton text="Успех" onPress={() => handleAttempt(true)} style={[styles.attemptButton, styles.successButton]} />
                            <SubmitButton text="Провал" onPress={() => handleAttempt(false)} style={[styles.attemptButton, styles.failButton]} />
                        </View>
                    </View>
                ) : (
                    <Text style={styles.finalScoreText}>Тест завершен. Результат: {score} из {DIGIT_LISTS[selectedList].length}</Text>
                )}

                <View style={styles.footerButtonsContainer}>
                    {isTestComplete && (
                        <SubmitButton text="Завершить тест" onPress={handleSubmit} style={styles.mainButton} />
                    )}
                    <SubmitButton text="Сбросить тест" onPress={handleResetConfirmation} style={[styles.mainButton, styles.resetButton]} />
                </View>
            </View>
        );
    }

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={styles.scrollContainer}>
            {currentStep === 'instruction' && renderInstructionStep()}
            {currentStep === 'testing' && renderTestingStep()}
        </ScrollViewKeyboardAwareContainer>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    stepContainer: {
        width: '100%',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    instructionText: {
        fontSize: 15,
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        lineHeight: 22,
    },
    italicInstruction: {
        fontStyle: 'italic',
        marginBottom: 24,
        paddingHorizontal: 10, // Ensure it doesn't touch edges
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        width: '100%',
    },
    pickerLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    picker: {
        width: 150,
        height: Platform.OS === 'android' ? 50 : undefined,
    },
    pickerItem: {
        height: Platform.OS === 'ios' ? 120 : undefined,
    },
    testingContent: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    digitStringDisplay: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        minWidth: 150,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
    attemptButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    attemptButton: {
        flex: 1, // Make buttons take equal space
        marginHorizontal: 8, // Add some space between buttons
    },
    successButton: {
        backgroundColor: '#4CAF50', // Green
    },
    failButton: {
        backgroundColor: '#F44336', // Red
    },
    finalScoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 30,
    },
    footerButtonsContainer: {
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    mainButton: {
        width: '100%',
        marginBottom: 12,
    },
    resetButton: {
        backgroundColor: '#E57373', // Softer red
    },
    actionButton: {
        marginTop: 20,
        width: '80%',
    },
}); 