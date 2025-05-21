import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import Timer from '@/components/Timer';
import SubmitButton from '@/components/SubmitButton';
import { router } from 'expo-router';

export default function TandemWalk() {
  const [attempt1, setAttempt1] = useState(0);
  const [attempt2, setAttempt2] = useState(0);
  const [attempt3, setAttempt3] = useState(0);
  const [runningIndex, setRunningIndex] = useState<number | null>(null);

  // Only count attempts > 0 for average
  const attempts = [attempt1, attempt2, attempt3].filter(v => v > 0);
  const averageResult = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : '-';
  const bestResult = attempts.length > 0 ? Math.min(...attempts) : '-';

  const handleStart = (index: number) => {
    setRunningIndex(index);
  };
  const handleStop = () => {
    setRunningIndex(null);
  };
  const handleReset = (index: number) => {
    if (runningIndex === index) setRunningIndex(null);
    if (index === 1) setAttempt1(0);
    if (index === 2) setAttempt2(0);
    if (index === 3) setAttempt3(0);
  };

  // Timer props generator
  const getTimerProps = (index: number, value: number, setValue: (v: number) => void) => ({
    onChange: setValue,
    style: styles.timer,
    initial: value,
    // Only running if runningIndex === index
    running: runningIndex === index,
    onStart: () => handleStart(index),
    onStop: handleStop,
    onReset: () => handleReset(index),
  });

  const handleSubmit = () => {
    // TODO: Save results and implement navigation to next screen
    router.push('/(testing-form)/tandem-walk-dual');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.header}>Тандемная походка</Text>
          <Text style={styles.instruction}>
            Проложите линию длиной 3 метра на полутвердой поверхности с помощью спортивной ленты. Задание должно быть простым. Пожалуйста, выполните все 3 испытания.
          </Text>
          <Text style={styles.instruction}>
            Скажите: "<Text style={styles.italicText}>Пожалуйста, быстро пройдите с пятки на носок до конца ленты, развернитесь и возвращайтесь так быстро, как только сможете, не расставляя ног и не сходя с линии</Text>".
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Одиночная задача</Text>
        </View>

        <View style={styles.timerSection}>
          <Text style={styles.timerHeader}>
            Время для завершения ходьбы тандемной походкой (секунды)
          </Text>

          <View style={styles.attemptRow}>
            <Text style={styles.attemptLabel}>Попытка 1</Text>
            <Timer {...getTimerProps(1, attempt1, setAttempt1)} />
          </View>

          <View style={styles.attemptRow}>
            <Text style={styles.attemptLabel}>Попытка 2</Text>
            <Timer {...getTimerProps(2, attempt2, setAttempt2)} />
          </View>

          <View style={styles.attemptRow}>
            <Text style={styles.attemptLabel}>Попытка 3</Text>
            <Timer {...getTimerProps(3, attempt3, setAttempt3)} />
          </View>

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
        </View>

        <SubmitButton 
          text="Далее" 
          onPress={handleSubmit} 
          style={styles.submitButton} 
        />
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
  },
  headerSection: {
    width: '100%',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  instruction: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
    lineHeight: 20,
  },
  italicText: {
    fontStyle: 'italic',
  },
  sectionHeader: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#2f2d51',
    fontSize: 16,
    fontWeight: '500',
  },
  timerSection: {
    width: '100%',
    marginBottom: 24,
  },
  timerHeader: {
    width: '100%',
    backgroundColor: '#fff',
    color: '#2f2d51',
    fontSize: 16,
    padding: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  attemptRow: {
    width: '100%',
    marginBottom: 16,
  },
  attemptLabel: {
    width: '100%',
    backgroundColor: '#fff',
    color: '#2f2d51',
    fontSize: 16,
    padding: 8,
    marginBottom: 8,
  },
  timer: {
    width: '100%',
  },
  resultsSection: {
    width: '100%',
    marginTop: 16,
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
  submitButton: {
    marginTop: 24,
    width: '100%',
  },
});