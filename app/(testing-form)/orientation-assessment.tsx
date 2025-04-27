import CheckboxField from '@/components/CheckboxField';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

const ORIENTATION_QUESTIONS = [
  { key: 'month', label: 'Какой сейчас месяц?' },
  { key: 'date', label: 'Сегодняшняя дата?' },
  { key: 'weekday', label: 'Какой сегодня день недели?' },
  { key: 'year', label: 'Какой сейчас год?' },
  { key: 'time', label: 'Сколько сейчас времени? (в пределах 1 часа)' },
];

export default function OrientationAssessment() {
  const [answers, setAnswers] = useState<{[key: string]: boolean}>(
    Object.fromEntries(ORIENTATION_QUESTIONS.map(q => [q.key, false]))
  );

  const handleChange = (key: string) => {
    setAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const score = ORIENTATION_QUESTIONS.reduce((sum, q) => sum + (answers[q.key] ? 1 : 0), 0);

  const handleSubmit = () => {
    console.log('Orientation assessment submitted', answers, 'Score:', score);
    router.push('/(testing-form)/short-term-memory');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.inputContainer}>
        <Text style={styles.instruction}><Text style={{ fontWeight: 'bold' }}>Скажите:</Text> <Text style={{ fontStyle: 'italic' }}>
          "Я задам вам несколько вопросов, пожалуйста, отвечайте максимально точно."
        </Text></Text>
        <View style={{ width: '100%', alignItems: 'center' }}>
          {ORIENTATION_QUESTIONS.map((q, idx) => (
            <CheckboxField
              key={q.key}
              label={q.label}
              checked={answers[q.key]}
              onChange={() => handleChange(q.key)}
              style={{ borderBottomWidth: idx === ORIENTATION_QUESTIONS.length - 1 ? 1 : 0 }}
            />
          ))}
        </View>
        <Text style={styles.scoreText}>Оценка ориентации: <Text style={{ fontWeight: 'bold' }}>{score}</Text> / 5</Text>
        <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 20 }} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  instruction: {
    fontSize: 15,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
}); 