import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import LabeledPicker from '@/components/LabeledPicker';
import SubmitButton from '@/components/SubmitButton';
import { Picker } from '@react-native-picker/picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Timer from '@/components/Timer';
import { router } from 'expo-router';

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
  const [practiceChecked, setPracticeChecked] = useState<boolean[]>(Array(PRACTICE_NUMBERS.length).fill(false));
  const [practiceTime, setPracticeTime] = useState(0);
  const [practiceTimerRunning, setPracticeTimerRunning] = useState(false);

  // Main section state
  const [mainStart, setMainStart] = useState<number>(MAIN_START_OPTIONS[0]);
  const [visibleTrial, setVisibleTrial] = useState<number>(0); // 0, 1, 2
  // trialsChecked[trialIdx][numIdx]
  const [trialsChecked, setTrialsChecked] = useState<boolean[][]>(
    Array(3).fill(0).map(() => Array(NUMBERS_PER_TRIAL).fill(false))
  );
  const [trialsTime, setTrialsTime] = useState<number[]>(Array(3).fill(0));
  const [trialsTimerRunning, setTrialsTimerRunning] = useState<boolean[]>(Array(3).fill(false));

  const handleSubmit = () => {
    router.push('/(testing-form)/tandem-walk-result');
  };

  // Handlers for practice
  const handlePracticeCheck = (idx: number) => {
    setPracticeChecked(prev => prev.map((v, i) => (i === idx ? !v : v)));
  };
  const handlePracticeTimerChange = (val: number) => setPracticeTime(val);
  const handlePracticeTimerStart = () => setPracticeTimerRunning(true);
  const handlePracticeTimerStop = () => setPracticeTimerRunning(false);
  const handlePracticeTimerReset = () => { setPracticeTime(0); setPracticeTimerRunning(false); };

  // Handlers for main trials
  const handleTrialCheck = (trialIdx: number, numIdx: number) => {
    setTrialsChecked(prev => prev.map((row, t) =>
      t === trialIdx ? row.map((v, n) => (n === numIdx ? !v : v)) : row
    ));
  };
  const handleTrialTimerChange = (trialIdx: number, val: number) => {
    setTrialsTime(prev => prev.map((v, i) => (i === trialIdx ? val : v)));
  };
  const handleTrialTimerStart = (trialIdx: number) => {
    setTrialsTimerRunning(prev => prev.map((v, i) => i === trialIdx));
  };
  const handleTrialTimerStop = (trialIdx: number) => {
    setTrialsTimerRunning(prev => prev.map((v, i) => (i === trialIdx ? false : v)));
  };
  const handleTrialTimerReset = (trialIdx: number) => {
    setTrialsTime(prev => prev.map((v, i) => (i === trialIdx ? 0 : v)));
    setTrialsTimerRunning(prev => prev.map((v, i) => (i === trialIdx ? false : v)));
  };

  // Dynamic numbers for main trials
  const mainNumbers = generateTrialNumbers(mainStart);

  // Error counts
  const practiceErrors = practiceChecked.filter(v => !v).length;
  const trialErrors = trialsChecked.map(row => row.filter(v => !v).length);

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
        <View style={styles.practiceRow}>
          {PRACTICE_NUMBERS.map((num, idx) => (
            <View key={num} style={styles.checkboxCol}>
              <BouncyCheckbox
                isChecked={practiceChecked[idx]}
                onPress={() => handlePracticeCheck(idx)}
                fillColor="#000"
                unFillColor="#fff"
                size={28}
                iconStyle={{ borderColor: '#000', borderRadius: 6 }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 6 }}
                style={{ marginBottom: 2, alignSelf: 'center', width: 28 }}
              />
              <Text style={styles.checkboxLabel}>{num}</Text>
            </View>
          ))}
        </View>
        <View style={styles.centeredRow}>
          <View style={styles.counterBlock}>
            <Text style={styles.inputLabel}>Ошибки</Text>
            <View style={styles.counter}><Text style={styles.counterText}>{practiceErrors}</Text></View>
          </View>
        </View>
        <View style={styles.centeredTimerRow}>
          <View style={styles.counterBlock}>
            <Text style={styles.inputLabel}>Время</Text>
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
          <View style={styles.trialRow}>
            {mainNumbers.map((num, numIdx) => (
              <View key={numIdx} style={styles.checkboxCol}>
                <BouncyCheckbox
                  isChecked={trialsChecked[visibleTrial][numIdx]}
                  onPress={() => handleTrialCheck(visibleTrial, numIdx)}
                  fillColor="#000"
                  unFillColor="#fff"
                  size={28}
                  iconStyle={{ borderColor: '#000', borderRadius: 6 }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 6 }}
                  style={{ marginBottom: 2, alignSelf: 'center', width: 28 }}
                />
                <Text style={styles.checkboxLabel}>{num}</Text>
              </View>
            ))}
          </View>
          <View style={styles.centeredRow}>
            <View style={styles.counterBlock}>
              <Text style={styles.inputLabel}>Ошибки</Text>
              <View style={styles.counter}><Text style={styles.counterText}>{trialErrors[visibleTrial]}</Text></View>
            </View>
          </View>
          <View style={styles.centeredTimerRow}>
            <View style={styles.counterBlock}>
              <Text style={styles.inputLabel}>Время</Text>
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
  practiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 8,
    gap: 4,
  },
  checkboxCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    marginHorizontal: 8,
    marginBottom: 4,
    paddingHorizontal: 0,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#222',
    marginTop: 2,
    textAlign: 'center',
    width: 44,
    position: 'relative',
    left: 0,
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
  counter: {
    minWidth: 36,
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#a05a00',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 2,
    paddingHorizontal: 8,
  },
  counterText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#a05a00',
    textAlign: 'center',
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  timerRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  trialBlock: {
    width: '100%',
    marginBottom: 12,
  },
  trialLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#2f2d51',
  },
  trialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
});