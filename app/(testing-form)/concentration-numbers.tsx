import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

const DIGIT_LISTS = {
    A: [
        ['4-9-3', '6-2-9'],
        ['3-8-1-4', '3-2-7-9'],
        ['6-2-9-7-1', '1-5-2-8-6'],
        ['7-1-8-4-6-2', '5-3-9-1-4-8'],
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

export default function ConcentrationNumbers() {
    const { medicalOfficeAssessment, updateConcentrationNumbers } = useFormContext();
    const [selectedList, setSelectedList] = useState<'A' | 'B' | 'V'>('A');
    // answers[trialIdx][rowIdx] = true/false
    const [answers, setAnswers] = useState(
        Array(4).fill(0).map(() => [false])
    );

    const handleListChange = (itemValue: string | number) => {
        const v = String(itemValue) as 'A' | 'B' | 'V';
        setSelectedList(v);
        setAnswers(Array(4).fill(0).map(() => [false]));
    };

    const handleCheck = (trialIdx: number) => {
        setAnswers(prev => {
            const updated = prev.map(arr => [...arr]);
            updated[trialIdx][0] = !updated[trialIdx][0];
            return updated;
        });
    };

    const score = answers.filter(arr => arr[0]).length;

    const handleSubmit = () => {
        // Сохраняем только название листа и score
        const newEntry: MedicalOfficeAssessment.ConcentrationNumbers = {
            numberList: selectedList,
            score,
        };
        updateConcentrationNumbers(newEntry);
        router.push('/(testing-form)/concentration-months');
    };

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
            <View style={styles.container}>
                <Text style={styles.instructions}>
                    <Text style={{ fontWeight: 'bold' }}>Повторение цифр в обратном порядке</Text>{'\n'}
                    Скорость тестирования составляет одна цифра в секунду. Читайте список комбинаций цифр из выбранной колонки сверху вниз. Если строка произнесена правильно, переходите к строке со следующим большим количеством цифр; если строка произнесена неправильно, используйте альтернативную строку с таким же количеством цифр; если это снова не удалось, завершите тест.{'\n'}
                    <Text style={{ fontStyle: 'italic' }}>
                        Скажите: "Я собираюсь прочитать последовательность чисел, и когда я закончу, вы повторите их мне в порядке, обратном тому, как я прочитал их вам. Например, если я скажу 7-1-9, вы скажете 9-1-7. Итак, если бы я сказал 9-6-8, вы бы ответили? (8-6-9)"
                    </Text>
                </Text>
                <View style={styles.pickerRow}>
                    <Text style={styles.pickerLabel}>Выберите список цифр</Text>
                    <Picker
                        selectedValue={selectedList}
                        onValueChange={handleListChange}
                        style={{ width: 100 }}
                    >
                        <Picker.Item label="A" value="A" />
                        <Picker.Item label="Б" value="B" />
                        <Picker.Item label="В" value="V" />
                    </Picker>
                </View>
                <View style={styles.tableHeader}>
                    <Text style={[styles.cell, styles.headerCell]}>Список {selectedList}</Text>
                </View>
                {DIGIT_LISTS[selectedList].map((row, trialIdx) => (
                    <View key={trialIdx} style={styles.tableRow}>
                        <View style={[styles.cell, { flex: 2 }]}>
                            <Text>{row[0]}</Text>
                            <Text>{row[1]}</Text>
                        </View>
                        <View style={styles.checkCell}>
                            <BouncyCheckbox
                                isChecked={answers[trialIdx][0]}
                                onPress={() => handleCheck(trialIdx)}
                                fillColor="#000"
                                unFillColor="#000"
                                iconStyle={{ borderColor: '#000', borderWidth: 2 }}
                                innerIconStyle={{ borderWidth: 2 }}
                                style={{ marginBottom: 0, alignSelf: 'flex-end' }}
                                size={28}
                                disableText
                            />
                        </View>
                    </View>
                ))}
                <Text style={styles.resultText}>Результат: <Text style={{ fontWeight: 'bold' }}>{score}</Text> из 4</Text>
                <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 24 }} />
            </View>
        </ScrollViewKeyboardAwareContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    instructions: {
        fontSize: 14,
        marginBottom: 18,
        color: '#333',
        alignSelf: 'flex-start',
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    pickerLabel: {
        fontSize: 16,
        marginRight: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 4,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    cell: {
        flex: 1,
        padding: 6,
        fontSize: 15,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#eee',
        minHeight: 44,
    },
    checkCell: {
        flex: 1,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        alignSelf: 'flex-start',
    },
}); 