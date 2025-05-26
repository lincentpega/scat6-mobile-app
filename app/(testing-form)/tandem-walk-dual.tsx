import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

function generateTrialNumbers(start: number) {
  return Array(NUMBERS_PER_TRIAL)
    .fill(0)
    .map((_, i) => start - i * 7);
}

export default function TandemWalkDual() {
  // Practice section state
  const [practiceErrorsCount, setPracticeErrorsCount] = useState(0);
  const [practiceTime, setPracticeTime] = useState(0);
  const [practiceTimerRunning, setPracticeTimerRunning] = useState(false);

  // Main section state
  const [mainStart, setMainStart] = useState<number>(MAIN_START_OPTIONS[0]);
  const [visibleTrial, setVisibleTrial] = useState<number>(0);
  const [trialsErrorsCount, setTrialsErrorsCount] = useState<number[]>(Array(3).fill(0));
  const [trialsTime, setTrialsTime] = useState<number[]>(Array(3).fill(0));
  const [trialsTimerRunning, setTrialsTimerRunning] = useState<boolean[]>(Array(3).fill(false));

  const { medicalOfficeAssessment, updateTandemWalkDualTask } = useFormContext();

  useEffect(() => {
    if (medicalOfficeAssessment.tandemWalkDualTask) {
      const {
        practice,
        cognitive,
      } = medicalOfficeAssessment.tandemWalkDualTask;

      if (practice) {
        setPracticeErrorsCount(practice.errors || 0);
        setPracticeTime(practice.time || 0);
      }
      if (cognitive) {
        if (cognitive.startNumber && MAIN_START_OPTIONS.includes(cognitive.startNumber)) {
          setMainStart(cognitive.startNumber);
        }
        if (cognitive.trials && cognitive.trials.length === 3) {
          setTrialsErrorsCount([
            cognitive.trials[0]?.errors || 0,
            cognitive.trials[1]?.errors || 0,
            cognitive.trials[2]?.errors || 0,
          ]);
          setTrialsTime([
            cognitive.trials[0]?.time || 0,
            cognitive.trials[1]?.time || 0,
            cognitive.trials[2]?.time || 0,
          ]);
        }
      }
    }
  }, [medicalOfficeAssessment.tandemWalkDualTask]);

  const handleSubmit = () => {
    const dataToSave: MedicalOfficeAssessment.TandemWalkDualTask = {
      practice: {
        errors: practiceErrorsCount,
        time: practiceTime,
      },
      cognitive: {
        startNumber: mainStart,
        trials: TRIALS.map((_, index) => ({
          id: index,
          errors: trialsErrorsCount[index],
          time: trialsTime[index],
          // Assuming checkedAnswers are not tracked in this simplified version for dual task
          // If they were, you'd need a state for them similar to short-term-memory
          checkedAnswers: generateTrialNumbers(mainStart).map(() => false) 
        })),
      }
    };
    updateTandemWalkDualTask(dataToSave);
    router.push('/(testing-form)/tandem-walk-result');
  };

  const handlePracticeTimerChange = useCallback((val: number) => setPracticeTime(val), []);
  const handlePracticeTimerStart = useCallback(() => setPracticeTimerRunning(true), []);
  const handlePracticeTimerStop = useCallback(() => setPracticeTimerRunning(false), []);
  const handlePracticeTimerReset = useCallback(() => { setPracticeTime(0); setPracticeTimerRunning(false); }, []);

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

  const mainNumbers = generateTrialNumbers(mainStart);

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start', backgroundColor: '#fff5eb', minHeight: '100%' }}>
      <View style={styles.container}>
        <Text style={styles.header}>Походка с двумя задачами</Text>
        <Text style={styles.instructions}>
          Проложите линию длиной 3 метра на полутвердой поверхности с помощью спортивной ленты. Выполнение задания должно быть рассчитано по времени.
        </Text>
        <Text style={styles.instructions}>
          <Text style={{ fontWeight: 'bold' }}>Скажите:</Text> "Теперь, пока вы ходите с пятки на носок, я попрошу вас считать вслух, вычитая из числа 7. Например, если бы мы начали со 100, вы бы сказали 100, 93, 86, 79. Давайте потренируемся считать. Начиная с 93, считайте в обратном порядке на семерки, пока я не скажу"
        </Text>
        <Text style={styles.sectionTitle}>Практика двойного задания</Text>
        <View style={styles.numberListContainer}>
          {PRACTICE_NUMBERS.map((num, idx) => (
            <Text key={idx} style={styles.numberListItem}>{num}{idx < PRACTICE_NUMBERS.length - 1 ? ', ' : ''}</Text>
          ))}
        </View>
        
        <View style={styles.centeredTimerRow}>
          <View style={styles.counterBlock}>
            <Text style={styles.inputLabel}>Время (Практика)</Text>
            <Timer
              onChange={handlePracticeTimerChange}
              initial={practiceTime}
              running={practiceTimerRunning}
              onStart={handlePracticeTimerStart}
              onStop={handlePracticeTimerStop}
              onReset={handlePracticeTimerReset}
              style={{ marginTop: 0 }}
            />
          </View>
        </View>

        <TimedClickerField 
            label="Ошибки (Практика)"
            errorCount={practiceErrorsCount}
            onErrorChange={setPracticeErrorsCount}
            maxErrors={PRACTICE_NUMBERS.length}
            hideTimer={true}
        />

        <Text style={styles.instructions}>
          <Text style={{ fontWeight: 'bold' }}>Скажите:</Text> "Хорошо. Теперь я попрошу вас походить с пятки на носок и одновременно считать вслух в обратном направлении. Вы готовы? Число, с которого нужно начать, - "
        </Text>
        <LabeledPicker
          label="Начальное число для основной задачи"
          selectedValue={mainStart}
          onValueChange={v => setMainStart(Number(v))}
          style={{ width: '100%', marginBottom: 12 }}
        >
          {MAIN_START_OPTIONS.map(opt => (
            <Picker.Item key={opt} label={opt.toString()} value={opt} />
          ))}
        </LabeledPicker>
        <Text style={styles.sectionTitle}>Когнитивная деятельность при выполнении двух задач</Text>
        <LabeledPicker
          label="Выберите попытку"
          selectedValue={visibleTrial.toString()}
          onValueChange={v => setVisibleTrial(Number(v))}
          style={{ width: '100%', marginBottom: 12 }}
        >
          {TRIALS.map((trial, idx) => (
            <Picker.Item key={trial} label={trial} value={idx.toString()} />
          ))}
        </LabeledPicker>
        
        <View style={styles.trialBlock}>
          <Text style={styles.trialLabel}>{TRIALS[visibleTrial]}</Text>
          <View style={styles.numberListContainer}>
            {mainNumbers.map((num, numIdx) => (
              <Text key={numIdx} style={styles.numberListItem}>{num}{numIdx < mainNumbers.length - 1 ? ', ' : ''}</Text>
            ))}
          </View>

          <View style={styles.centeredTimerRow}>
            <View style={styles.counterBlock}>
              <Text style={styles.inputLabel}>Время ({TRIALS[visibleTrial]})</Text>
              <Timer
                onChange={val => handleTrialTimerChange(visibleTrial, val)}
                initial={trialsTime[visibleTrial]}
                running={trialsTimerRunning[visibleTrial]}
                onStart={() => handleTrialTimerStart(visibleTrial)}
                onStop={() => handleTrialTimerStop(visibleTrial)}
                onReset={() => handleTrialTimerReset(visibleTrial)}
                style={{ marginTop: 0 }}
              />
            </View>
          </View>

          <TimedClickerField 
            label={`Ошибки (${TRIALS[visibleTrial]})`}
            errorCount={trialsErrorsCount[visibleTrial]}
            onErrorChange={(newCount) => {
                const newCounts = [...trialsErrorsCount];
                newCounts[visibleTrial] = newCount;
                setTrialsErrorsCount(newCounts);
            }}
            maxErrors={NUMBERS_PER_TRIAL}
            hideTimer={true}
          />
        </View>
        <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 24, width: '100%' }} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: '#fff5eb',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  instructions: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: '#a05a00',
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
  centeredRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  counterBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredTimerRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
    fontWeight: '500',
  },
  trialBlock: {
    width: '100%',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#e6f3ff',
    borderRadius: 8,
  },
  trialLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    color: '#1a508b',
    textAlign: 'center',
  },
});