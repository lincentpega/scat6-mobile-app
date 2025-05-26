import React, { useState, useEffect } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import LabeledPicker from '@/components/LabeledPicker';
import CheckboxField from '@/components/CheckboxField';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment as FullMedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

const WORD_LISTS = {
  A: [
    'Куртка', 'Стрела', 'Перец', 'Хлопок', 'Кино',
    'Доллар', 'Мёд', 'Зеркало', 'Седло', 'Якорь',
  ],
  B: [
    'Палец', 'Копейка', 'Одеяло', 'Лимон', 'Насекомое',
    'Свеча', 'Бумага', 'Сахар', 'Бутерброд', 'Повозка',
  ],
  C: [
    'Малыш', 'Обезьяна', 'Духи', 'Закат', 'Железо',
    'Локоть', 'Яблоко', 'Ковер', 'Седло', 'Пузырь',
  ],
};

const TRIALS = ['Проба 1', 'Проба 2', 'Проба 3'];
const NUMBER_OF_TRIALS = TRIALS.length;

export default function ShortTermMemory() {
  const { medicalOfficeAssessment, updateShortTermMemory } = useFormContext();
  
  const [selectedList, setSelectedList] = useState<'A' | 'B' | 'C'>('A');
  const [activeTrialIndex, setActiveTrialIndex] = useState<number>(0); // 0, 1, 2
  
  // Stores answers for each trial: trialAnswers[trialIndex][wordIndex]
  const [trialAnswers, setTrialAnswers] = useState<boolean[][]>(() => {
    // Try to load from context if available
    const { shortTermMemory } = medicalOfficeAssessment;
    if (
      shortTermMemory &&
      typeof shortTermMemory === 'object' &&
      !Array.isArray(shortTermMemory) &&
      shortTermMemory.list === selectedList &&
      Array.isArray(shortTermMemory.trials)
    ) {
      // If context has data, reconstruct answers as all false (no way to restore which words were checked)
      // So just initialize as all false
      return Array(NUMBER_OF_TRIALS)
        .fill(0)
        .map(() => Array(WORD_LISTS[selectedList].length).fill(false));
    }
    // Default: all false
    return Array(NUMBER_OF_TRIALS)
      .fill(0)
      .map(() => Array(WORD_LISTS[selectedList].length).fill(false));
  });

  // When list changes, reset all answers
  useEffect(() => {
    setTrialAnswers(
      Array(NUMBER_OF_TRIALS)
        .fill(0)
        .map(() => Array(WORD_LISTS[selectedList].length).fill(false))
  );
    setActiveTrialIndex(0);
  }, [selectedList]);

  // When context changes (external update), reset answers if list matches
  useEffect(() => {
    const { shortTermMemory } = medicalOfficeAssessment;
    if (
      shortTermMemory &&
      typeof shortTermMemory === 'object' &&
      !Array.isArray(shortTermMemory) &&
      shortTermMemory.list === selectedList &&
      Array.isArray(shortTermMemory.trials)
    ) {
      // No way to restore which words were checked, so do nothing
    }
  }, [medicalOfficeAssessment.shortTermMemory, selectedList]);

  const handleListChange = (itemValue: string | number) => {
    const newList = String(itemValue) as 'A' | 'B' | 'C';
    setSelectedList(newList);
    // useEffect will reset answers and activeTrialIndex
  };

  const handleTrialPickerChange = (itemValue: string | number) => {
    setActiveTrialIndex(Number(itemValue));
  };

  const handleCheckboxChange = (wordIdx: number) => {
    setTrialAnswers(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[activeTrialIndex][wordIdx] = !updated[activeTrialIndex][wordIdx];
      return updated;
    });
  };

  const handleSubmit = () => {
    // For each trial, count checked words
    const trialsData: Array<{ trial: number; score: number }> = trialAnswers.map((answers, i) => ({
        trial: i,
      score: answers.filter(Boolean).length,
    }));
    const dataToSave: FullMedicalOfficeAssessment.ShortTermMemory = {
      list: selectedList,
      trials: trialsData,
      testFinishTime: new Date().toISOString(),
    };
    updateShortTermMemory(dataToSave);
    router.push('/(testing-form)/concentration-numbers');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <Text style={styles.header}>Кратковременная память</Text>
        <Text style={styles.instructions}>
          Все 3 пробы должны быть выполнены независимо от номера, указанного в первой пробе. Проводите оценку со скоростью одно слово в секунду.{"\n\n"}
          <Text style={{ fontWeight: 'bold' }}>Проба 1:</Text> Скажите: "Я собираюсь проверить вашу память. Я зачитаю Вам список слов, и, когда я закончу, повторите столько слов, сколько сможете запомнить, в любом порядке."{"\n\n"}
          <Text style={{ fontWeight: 'bold' }}>Пробы 2 и 3:</Text> Скажите: "Я собираюсь повторить тот же список. Повторите столько слов, сколько сможете запомнить, в любом порядке, даже если вы произносили это слово раньше в предыдущем испытании."
        </Text>
        <LabeledPicker
          label="Выберите список слов"
          selectedValue={selectedList}
          onValueChange={itemValue => handleListChange(itemValue as string | number)}
          style={{ width: '100%', marginVertical: 12 }}
        >
          <Picker.Item label="A" value="A" />
          <Picker.Item label="B" value="B" />
          <Picker.Item label="C" value="C" />
        </LabeledPicker>
        <LabeledPicker
          label="Проба"
          selectedValue={activeTrialIndex.toString()}
          onValueChange={itemValue => handleTrialPickerChange(itemValue as string | number)}
          style={{ width: '100%', marginBottom: 16 }}
        >
          {TRIALS.map((trial, idx) => (
            <Picker.Item key={trial} label={trial} value={`${idx}`} />
          ))}
        </LabeledPicker>
        <View style={styles.wordsList}>
          {WORD_LISTS[selectedList].map((word, wordIdx) => (
            <CheckboxField
              key={`${selectedList}-${activeTrialIndex}-${word}`}
              label={word}
              checked={trialAnswers[activeTrialIndex][wordIdx]}
              onChange={() => handleCheckboxChange(wordIdx)}
              style={[
                styles.checkboxRow,
                { borderBottomWidth: wordIdx === WORD_LISTS[selectedList].length - 1 ? 1 : 0 }
              ]}
            />
          ))}
        </View>
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
  wordsList: {
    width: '100%',
    marginBottom: 10,
  },
  checkboxRow: {
    borderBottomWidth: 0,
  },
});
