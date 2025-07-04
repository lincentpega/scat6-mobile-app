import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import InputLabel from '@/components/InputLabel';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

const MONTHS_REVERSED = [
  'ДЕКАБРЬ',
  'НОЯБРЬ',
  'ОКТЯБРЬ',
  'СЕНТЯБРЬ',
  'АВГУСТ',
  'ИЮЛЬ',
  'ИЮНЬ',
  'МАЙ',
  'АПРЕЛЬ',
  'МАРТ',
  'ФЕВРАЛЬ',
  'ЯНВАРЬ',
];

type AttemptResult = 'pending' | 'success' | 'fail';

export default function ConcentrationMonths() {
  const { updateConcentrationMonths } = useFormContext();
  const [errors, setErrors] = useState('0');
  const [attemptResult, setAttemptResult] = useState<AttemptResult>('pending');

  const errorsNum = parseInt(errors, 10);
  const score = attemptResult === 'success' ? 1 : 0;

  const handleAttempt = (wasSuccessful: boolean) => {
    if (wasSuccessful) {
      setAttemptResult('success');
      setErrors('0'); // On success, errors are 0
    } else {
      setAttemptResult('fail');
      // Errors can be manually entered if it was a fail
    }
  };

  const handleSubmit = () => {
    const data: MedicalOfficeAssessment.ConcentrationMonths = {
      errors: attemptResult === 'success' ? 0 : (isNaN(errorsNum) ? 1 : errorsNum), // If success, 0 errors. If fail, use input or default to 1 if input is invalid.
      score: score,
    };
    updateConcentrationMonths(data);
    router.push('/(testing-form)/coordination-and-balance-mbess');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Перечисление месяцев в обратном порядке</Text>
        <Text style={styles.instructions}>
          <Text style={{ fontWeight: 'bold' }}>Скажите: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            "Теперь назовите мне месяцы года в обратном порядке, как можно быстрее и точнее. Начните с последнего месяца и двигайтесь в обратном направлении. Итак, вы скажете декабрь, ноябрь… продолжайте."
          </Text>
        </Text>
        <InputLabel label="Правильный порядок:" />
        <View style={styles.monthsList}>
          {MONTHS_REVERSED.map((month, idx) => (
            <Text key={month} style={styles.monthItem}>{month}{idx < MONTHS_REVERSED.length - 1 ? ' – ' : ''}</Text>
          ))}
        </View>

        {attemptResult === 'pending' && (
          <View style={styles.attemptButtonsContainer}>
            <SubmitButton text="Успех" onPress={() => handleAttempt(true)} style={[styles.attemptButton, styles.successButton]} />
            <SubmitButton text="Провал" onPress={() => handleAttempt(false)} style={[styles.attemptButton, styles.failButton]} />
          </View>
        )}

        {attemptResult !== 'pending' && (
          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Результат зафиксирован: {attemptResult === 'success' ? 'Успех' : 'Провал'}</Text>
            {attemptResult === 'fail' && (
                <View style={styles.inputRowSingle}>
                    <InputLabel label="Количество ошибок" />
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={errors}
                        onChangeText={setErrors}
                        placeholder="0"
                        maxLength={2}
                    />
                </View>
            )}
            <Text style={styles.finalScoreText}>Итоговый балл: <Text style={{ fontWeight: 'bold' }}>{score}</Text> из 1</Text>
          </View>
        )}
        
        <SubmitButton text="Далее" onPress={handleSubmit} style={styles.submitButton} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  monthsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  monthItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    paddingHorizontal: 3, // Add some spacing around the hyphen
  },
  attemptButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  attemptButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  successButton: {
    backgroundColor: '#4CAF50', // Green
  },
  failButton: {
    backgroundColor: '#F44336', // Red
  },
  resultSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50'
  },
  inputRowSingle: {
    width: '60%', // Or adjust as needed
    marginBottom: 15,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f7f7fa',
    width: '100%',
    textAlign: 'center',
  },
  finalScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  submitButton: {
    marginTop: 24,
    width: '80%',
  },
});