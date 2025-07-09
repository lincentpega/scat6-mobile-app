import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import Timer from '@/components/Timer';
import SubmitButton from '@/components/SubmitButton';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

type Step = 'instruction' | 'trial1' | 'trial2' | 'trial3';

export default function TandemWalk() {
  const { medicalOfficeAssessment, updateTandemWalkIsolatedTask } = useFormContext();

  // Initialize attempts from context or default to 0
  const initialAttempts = medicalOfficeAssessment.tandemWalkIsolatedTask?.trials || [0, 0, 0];
  const [currentStep, setCurrentStep] = useState<Step>('instruction');
  const [attempt1, setAttempt1] = useState(initialAttempts[0] || 0);
  const [attempt2, setAttempt2] = useState(initialAttempts[1] || 0);
  const [attempt3, setAttempt3] = useState(initialAttempts[2] || 0);
  const [isRunning, setIsRunning] = useState(false);

  const proceedToNextStep = () => {
    if (currentStep === 'instruction') setCurrentStep('trial1');
    else if (currentStep === 'trial1') setCurrentStep('trial2');
    else if (currentStep === 'trial2') setCurrentStep('trial3');
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (currentStep === 'trial1') setAttempt1(0);
    else if (currentStep === 'trial2') setAttempt2(0);
    else if (currentStep === 'trial3') setAttempt3(0);
  };

  const saveTandemWalkData = () => {
    const isolatedTaskData: MedicalOfficeAssessment.TandemWalkIsolatedTask = {
      trials: [attempt1, attempt2, attempt3],
    };

    updateTandemWalkIsolatedTask(isolatedTaskData);
  };

  const handleFinishTesting = () => {
    saveTandemWalkData();
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
            setAttempt1(0);
            setAttempt2(0);
            setAttempt3(0);
            setIsRunning(false);
            setCurrentStep('instruction');
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderInstructionStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Тандемная походка</Text>
      <Text style={styles.instruction}>
        Проложите линию длиной 3 метра на полутвердой поверхности с помощью спортивной ленты. Задание должно быть простым. Пожалуйста, выполните все 3 испытания.
      </Text>
      <SubmitButton text="Перейти к первой попытке" onPress={proceedToNextStep} style={styles.actionButton} />
    </View>
  );

  const renderTrialStep = (trialNumber: number) => {
    const isLastTrial = trialNumber === 3;
    let currentValue: number;
    let setValue: (value: number) => void;

    if (trialNumber === 1) {
      currentValue = attempt1;
      setValue = setAttempt1;
    } else if (trialNumber === 2) {
      currentValue = attempt2;
      setValue = setAttempt2;
    } else {
      currentValue = attempt3;
      setValue = setAttempt3;
    }

    // Calculate results for display on final trial
    const attempts = [attempt1, attempt2, attempt3].filter(v => v > 0);
    const averageResult = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : '-';
    const bestResult = attempts.length > 0 ? Math.min(...attempts) : '-';

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.header}>Попытка {trialNumber}</Text>
        <Text style={styles.instruction}>
          Скажите: "<Text style={styles.italicText}>Пожалуйста, быстро пройдите с пятки на носок до конца ленты, развернитесь и возвращайтесь так быстро, как только сможете, не расставляя ног и не сходя с линии</Text>".
        </Text>
        <Text style={styles.trialInstruction}>
          Время для завершения ходьбы тандемной походкой (секунды)
        </Text>
        
        <View style={styles.timerContainer}>
          <Timer
            onChange={setValue}
            style={styles.timer}
            initial={currentValue}
            running={isRunning}
            onStart={handleStart}
            onStop={handleStop}
            onReset={handleReset}
          />
        </View>

        {isLastTrial && attempts.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Средний результат</Text>
              <Text style={styles.resultValue}>{averageResult}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Лучший результат</Text>
              <Text style={styles.resultValue}>{bestResult}</Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {isLastTrial ? (
            <SubmitButton
              text="Завершить тестирование"
              onPress={handleFinishTesting}
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
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
    lineHeight: 20,
    alignSelf: 'flex-start',
  },
  italicText: {
    fontStyle: 'italic',
  },
  sectionHeader: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    color: '#2f2d51',
    fontSize: 16,
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 15,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  trialInstruction: {
    width: '100%',
    backgroundColor: '#fff',
    color: '#2f2d51',
    fontSize: 16,
    padding: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  timerContainer: {
    width: '100%',
    marginBottom: 24,
  },
  timer: {
    width: '100%',
  },
  resultsSection: {
    width: '100%',
    marginBottom: 24,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1A1A1A',
    padding: 8,
    marginBottom: 8,
  },
  resultLabel: {
    color: '#fff',
    fontSize: 16,
  },
  resultValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
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