import React, { useState, useEffect } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import LabeledPicker from '@/components/LabeledPicker';
import CheckboxField from '@/components/CheckboxField';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment as FullMedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import { WordListKey } from '@/constants/app-types';

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

const NUMBER_OF_TRIALS = 3;

type Step = 'instruction' | 'trial1' | 'trial2' | 'trial3';

type TrialAnswers = {
  trial1: boolean[];
  trial2: boolean[];
  trial3: boolean[];
};

export default function ShortTermMemory() {
  const { updateShortTermMemory } = useFormContext();
  
  const createEmptyTrialAnswers = (): TrialAnswers => ({
    trial1: Array(WORD_LISTS[selectedListKey].length).fill(false),
    trial2: Array(WORD_LISTS[selectedListKey].length).fill(false),
    trial3: Array(WORD_LISTS[selectedListKey].length).fill(false),
  });
  
  const [selectedListKey, setSelectedListKey] = useState<WordListKey>('A');
  const [currentStep, setCurrentStep] = useState<Step>('instruction');
  
  const [trialAnswers, setTrialAnswers] = useState<TrialAnswers>(createEmptyTrialAnswers);

  useEffect(() => {
    // Reset answers when the selected list changes, but only if we're still on instruction step
    if (currentStep === 'instruction') {
      setTrialAnswers(createEmptyTrialAnswers());
    }
  }, [selectedListKey]);

  const handleListChange = (itemValue: string | number) => {
    const newListKey = String(itemValue) as WordListKey;
    setSelectedListKey(newListKey);
  };

  const handleCheckboxChange = (trial: keyof TrialAnswers, wordIdx: number) => {
    setTrialAnswers(prev => ({
      ...prev,
      [trial]: prev[trial].map((answer, idx) => 
        idx === wordIdx ? !answer : answer
      ),
    }));
  };

  const handleSubmit = () => {
    const trial1Score = trialAnswers.trial1.filter(answer => answer === true).length;
    const trial2Score = trialAnswers.trial2.filter(answer => answer === true).length;
    const trial3Score = trialAnswers.trial3.filter(answer => answer === true).length;
    const totalScore = trial1Score + trial2Score + trial3Score;

    const dataToSave: FullMedicalOfficeAssessment.ShortTermMemory = {
      list: selectedListKey,
      trial1Score,
      trial2Score,
      trial3Score,
      totalScore,
      testFinishTime: new Date(),
    };
    updateShortTermMemory(dataToSave);
    router.push('/(testing-form)/concentration-numbers');
  };

  const proceedToNextStep = () => {
    if (currentStep === 'instruction') setCurrentStep('trial1');
    else if (currentStep === 'trial1') setCurrentStep('trial2');
    else if (currentStep === 'trial2') setCurrentStep('trial3');
  };

  const handleResetConfirmation = () => {
    Alert.alert(
      "Сбросить тест?",
      "Вы уверены, что хотите сбросить все ответы для текущего списка слов и начать заново с экрана инструкций?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Сбросить",
          onPress: () => {
            setTrialAnswers(createEmptyTrialAnswers());
            setCurrentStep('instruction');
          },
          style: "destructive"
        }
      ]
    );
  };

  const getPickerLabel = (listKey: WordListKey) => {
    const firstWord = WORD_LISTS[listKey][0];
    return `${listKey} (${firstWord}...)`;
  };

  const getTrialKey = (trialIndex: number): keyof TrialAnswers => {
    if (trialIndex === 0) return 'trial1';
    if (trialIndex === 1) return 'trial2';
    if (trialIndex === 2) return 'trial3';
    throw new Error(`Invalid trial index: ${trialIndex}`);
  };

  const renderInstructionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Кратковременная память</Text>
      <Text style={styles.generalInstruction}>
        Спортсмену будут зачитываться слова, его задача их воспроизводить на память. Всего дается 3 попытки вне зависимости от того, сколько слов спортсмен повторит при первой попытке. Скорость тестирования составляет одно слово в секунду.
      </Text>
      <Text style={styles.instructionHeader}>Выберите список слов для тестирования:</Text>
      <LabeledPicker
        label="Список слов"
        selectedValue={selectedListKey}
        onValueChange={(value) => handleListChange(String(value))}
        style={{ width: '100%', marginVertical: 12 }}
      >
        <Picker.Item label={getPickerLabel('A')} value="A" />
        <Picker.Item label={getPickerLabel('B')} value="B" />
        <Picker.Item label={getPickerLabel('C')} value="C" />
      </LabeledPicker>
      <SubmitButton text="Перейти к первой попытке" onPress={proceedToNextStep} style={{ marginTop: 24 }} />
    </View>
  );

  const renderTrialStep = (trialIndex: number) => {
    const isLastTrial = trialIndex === NUMBER_OF_TRIALS - 1;
    const trialKey = getTrialKey(trialIndex);
    let instructionText = null;

    if (trialIndex === 0) {
      instructionText = (
        <Text style={styles.trialInstruction}>
          <Text style={{ fontWeight: 'bold' }}>Проба 1:</Text> Скажите: "Я собираюсь проверить вашу память. Я зачитаю Вам список слов, и, когда я закончу, повторите столько слов, сколько сможете запомнить, в любом порядке."
        </Text>
      );
    } else if (trialIndex === 1) { // For Trial 2 (index 1)
      instructionText = (
        <Text style={styles.trialInstruction}>
          <Text style={{ fontWeight: 'bold' }}>Пробы 2 и 3:</Text> Скажите: "Я собираюсь повторить тот же список. Повторите столько слов, сколько сможете запомнить, в любом порядке, даже если вы произносили это слово раньше в предыдущем испытании."
        </Text>
      );
    } // Trial 3 (index 2) has no specific instruction text as per request

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.header}>Проба {trialIndex + 1}</Text>
        {instructionText}
        <View style={styles.wordsList}>
          {WORD_LISTS[selectedListKey].map((word, wordIdx) => (
            <CheckboxField
              key={`${selectedListKey}-${trialIndex}-${word}`}
              label={word}
              checked={trialAnswers[trialKey][wordIdx] ?? false}
              onChange={() => handleCheckboxChange(trialKey, wordIdx)}
              style={styles.checkboxRow}
            />
          ))}
        </View>
        {isLastTrial ? (
          <SubmitButton text="Завершить и сохранить" onPress={handleSubmit} style={{ marginTop: 24 }} />
        ) : (
          <SubmitButton text={`Перейти к пробе ${trialIndex + 2}`} onPress={proceedToNextStep} style={{ marginTop: 24 }} />
        )}
        {isLastTrial && (
          <SubmitButton 
            text="Сбросить тест" 
            onPress={handleResetConfirmation} 
            style={styles.resetButton}
          />
        )}
      </View>
    );
  }

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {currentStep === 'instruction' && renderInstructionStep()}
        {currentStep === 'trial1' && renderTrialStep(0)}
        {currentStep === 'trial2' && renderTrialStep(1)}
        {currentStep === 'trial3' && renderTrialStep(2)}
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  generalInstruction: {
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    alignSelf: 'flex-start',
    lineHeight: 20,
  },
  instructionHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    alignSelf: 'flex-start',
  },
  trialInstruction: {
    fontSize: 14,
    marginBottom: 12,
    color: '#333',
    alignSelf: 'flex-start',
    fontStyle: 'italic',
  },
  wordsList: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  checkboxRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resetButton: {
    backgroundColor: '#E57373',
    marginTop: 20,
  },
});
