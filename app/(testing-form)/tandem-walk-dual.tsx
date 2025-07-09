import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import LabeledPicker from '@/components/LabeledPicker';
import SubmitButton from '@/components/SubmitButton';
import { Picker } from '@react-native-picker/picker';
import Timer from '@/components/Timer';
import TimedClickerField from '@/components/TimedClickerField';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

const PRACTICE_NUMBERS = [93, 86, 79, 72, 65, 58, 51, 44];
const MAIN_START_OPTIONS = [88, 90, 98];
const TRIALS = ['Попытка 1', 'Попытка 2', 'Попытка 3'];
const NUMBERS_PER_TRIAL = 13;

type Step = 'instruction' | 'trial1' | 'trial2' | 'trial3';

function generateTrialNumbers(start: number) {
  return Array(NUMBERS_PER_TRIAL)
    .fill(0)
    .map((_, i) => start - i * 7);
}

export default function TandemWalkDual() {
  const [currentStep, setCurrentStep] = useState<Step>('instruction');
  
  // Main section state
  const [mainStart, setMainStart] = useState<number>(MAIN_START_OPTIONS[0]);
  const [trialsErrorsCount, setTrialsErrorsCount] = useState<number[]>(Array(3).fill(0));
  const [trialsTime, setTrialsTime] = useState<number[]>(Array(3).fill(0));
  const [trialsTimerRunning, setTrialsTimerRunning] = useState<boolean[]>(Array(3).fill(false));

  const { medicalOfficeAssessment, updateTandemWalkDualTask } = useFormContext();

  useEffect(() => {
    if (medicalOfficeAssessment.tandemWalkDualTask) {
      const {
        startNumber,
        trials,
      } = medicalOfficeAssessment.tandemWalkDualTask;

      if (startNumber && MAIN_START_OPTIONS.includes(startNumber)) {
        setMainStart(startNumber);
      }
      if (trials && trials.length === 3) {
        setTrialsErrorsCount([
          trials[0]?.errors || 0,
          trials[1]?.errors || 0,
          trials[2]?.errors || 0,
        ]);
        setTrialsTime([
          trials[0]?.time || 0,
          trials[1]?.time || 0,
          trials[2]?.time || 0,
        ]);
      }
    }
  }, [medicalOfficeAssessment.tandemWalkDualTask]);

  const proceedToNextStep = () => {
    if (currentStep === 'trial1') stopTrialTimer(0);
    else if (currentStep === 'trial2') stopTrialTimer(1);
    else if (currentStep === 'trial3') stopTrialTimer(2);

    if (currentStep === 'instruction') setCurrentStep('trial1');
    else if (currentStep === 'trial1') setCurrentStep('trial2');
    else if (currentStep === 'trial2') setCurrentStep('trial3');
  };

  const handleSubmit = () => {
    stopAllTimers();
    const dataToSave: MedicalOfficeAssessment.TandemWalkDualTask = {
      startNumber: mainStart,
      trials: TRIALS.map((_, index) => ({
        id: index,
        errors: trialsErrorsCount[index],
        time: trialsTime[index],
      })),
    };
    console.log('Tandem Walk Dual Results:', dataToSave);
    updateTandemWalkDualTask(dataToSave);
    router.push('/(testing-form)/tandem-walk-result');
  };

  const handleResetConfirmation = () => {
    Alert.alert(
      "Сбросить тест?",
      "Вы уверены, что хотите сбросить все результаты и начать заново с экрана инструкций?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Сбросить",
          onPress: () => {
            setTrialsErrorsCount(Array(3).fill(0));
            setTrialsTime(Array(3).fill(0));
            setTrialsTimerRunning(Array(3).fill(false));
            setCurrentStep('instruction');
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleTrialTimerChange = useCallback((trialIdx: number, val: number) => {
    setTrialsTime(prev => prev.map((v, i) => (i === trialIdx ? val : v)));
  }, []);
  
  const handleTrialTimerStart = useCallback((trialIdx: number) => {
    setTrialsTimerRunning(prev => prev.map((v, i) => (i === trialIdx ? true : v)));
  }, []);
  
  const handleTrialTimerStop = useCallback((trialIdx: number) => {
    setTrialsTimerRunning(prev => prev.map((v, i) => (i === trialIdx ? false : v)));
  }, []);
  
  const handleTrialTimerReset = useCallback((trialIdx: number) => {
    setTrialsTime(prev => prev.map((v, i) => (i === trialIdx ? 0 : v)));
    setTrialsTimerRunning(prev => prev.map((v, i) => (i === trialIdx ? false : v)));
  }, []);

  const stopTrialTimer = (trialIdx: number) => {
    setTrialsTimerRunning(prev => prev.map((v, i) => (i === trialIdx ? false : v)));
  };

  const stopAllTimers = () => {
    setTrialsTimerRunning(Array(3).fill(false));
  };

  const renderInstructionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Походка с двумя задачами</Text>
      <Text style={styles.instruction}>
        Проложите линию длиной 3 метра на полутвердой поверхности с помощью спортивной ленты. Выполнение задания должно быть рассчитано по времени.
      </Text>
      <Text style={styles.instruction}>
        <Text style={{ fontWeight: 'bold' }}>Скажите:</Text> "Теперь, пока вы ходите с пятки на носок, я попрошу вас считать вслух, вычитая из числа 7. Например, если бы мы начали со 100, вы бы сказали 100, 93, 86, 79. Давайте потренируемся считать. Начиная с 93, считайте в обратном порядке на семерки, пока я не скажу"
      </Text>
      <View style={{...styles.numberListContainer, marginBottom: 25}}>
        {PRACTICE_NUMBERS.map((num, idx) => (
          <Text key={idx} style={styles.numberListItem}>{num}{idx < PRACTICE_NUMBERS.length - 1 ? ', ' : ''}</Text>
        ))}
      </View>
      <LabeledPicker
        label="Выберите начальное число для основной задачи"
        selectedValue={mainStart}
        onValueChange={v => setMainStart(Number(v))}
        style={{ width: '100%', marginBottom: 12 }}
      >
        {MAIN_START_OPTIONS.map(opt => (
          <Picker.Item key={opt} label={opt.toString()} value={opt} />
        ))}
      </LabeledPicker>

      <View style={styles.buttonContainer}>
        <SubmitButton text="Перейти к попытке 1" onPress={proceedToNextStep} style={styles.mainButton} />
        <SubmitButton 
          text="Сбросить тест" 
          onPress={handleResetConfirmation} 
          style={[styles.mainButton, styles.resetButton]}
        />
      </View>
    </View>
  );

  const renderTrialStep = (trialNumber: number) => {
    const trialIndex = trialNumber - 1;
    const isLastTrial = trialNumber === 3;
    const mainNumbers = generateTrialNumbers(mainStart);

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.header}>Когнитивная деятельность при выполнении двух задач</Text>
        <Text style={styles.trialHeader}>{TRIALS[trialIndex]}</Text>
        <Text style={styles.instruction}>
          Пациент должен идти с пятки на носок и одновременно считать в обратном порядке, начиная с числа {mainStart}.
        </Text>
        
        <View style={styles.numberListContainer}>
          {mainNumbers.map((num, numIdx) => (
            <Text key={numIdx} style={styles.numberListItem}>{num}{numIdx < mainNumbers.length - 1 ? ', ' : ''}</Text>
          ))}
        </View>

        <View style={styles.centeredTimerRow}>
          <View style={styles.counterBlock}>
            <Text style={styles.inputLabel}>Время ({TRIALS[trialIndex]})</Text>
            <Timer
              onChange={val => handleTrialTimerChange(trialIndex, val)}
              initial={trialsTime[trialIndex]}
              running={trialsTimerRunning[trialIndex]}
              onStart={() => handleTrialTimerStart(trialIndex)}
              onStop={() => handleTrialTimerStop(trialIndex)}
              onReset={() => handleTrialTimerReset(trialIndex)}
              style={{ marginTop: 0 }}
            />
          </View>
        </View>

        <TimedClickerField 
          label={`Ошибки (${TRIALS[trialIndex]})`}
          errorCount={trialsErrorsCount[trialIndex]}
          onErrorChange={(newCount) => {
            const newCounts = [...trialsErrorsCount];
            newCounts[trialIndex] = newCount;
            setTrialsErrorsCount(newCounts);
          }}
          maxErrors={NUMBERS_PER_TRIAL}
          hideTimer={true}
        />

        <View style={styles.buttonContainer}>
          {isLastTrial ? (
            <SubmitButton
              text="Завершить тестирование"
              onPress={handleSubmit}
              style={styles.mainButton}
            />
          ) : (
            <SubmitButton text={`Перейти к попытке ${trialNumber + 1}`} onPress={proceedToNextStep} style={styles.mainButton} />
          )}
          <SubmitButton 
            text="Сбросить тест" 
            onPress={handleResetConfirmation} 
            style={[styles.mainButton, styles.resetButton]}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={styles.scrollContainer}>
      {currentStep === 'instruction' && renderInstructionStep()}
      {currentStep === 'trial1' && renderTrialStep(1)}
      {currentStep === 'trial2' && renderTrialStep(2)}
      {currentStep === 'trial3' && renderTrialStep(3)}
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'flex-start',
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
    alignSelf: 'flex-start',
  },
  instruction: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
    alignSelf: 'flex-start',
  },
  trialHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a508b',
    alignSelf: 'flex-start',
  },
  numberListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  numberListItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginRight: 4,
  },
  centeredTimerRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  mainButton: {
    width: '100%',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#E57373',
  },
  actionButton: {
    marginTop: 20,
    width: '80%',
  },
});