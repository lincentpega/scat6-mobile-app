import CheckboxField from '@/components/CheckboxField';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import { saveOrientationAssessment, loadOrientationAssessment } from '@/services/medicalOfficeAssessmentStorageService';

const ORIENTATION_QUESTIONS = [
  { key: 'month', label: 'Какой сейчас месяц?' },
  { key: 'date', label: 'Сегодняшняя дата?' },
  { key: 'weekday', label: 'Какой сегодня день недели?' },
  { key: 'year', label: 'Какой сейчас год?' },
  { key: 'time', label: 'Сколько сейчас времени? (в пределах 1 часа)' },
];

export default function OrientationAssessment() {
  // Initialize state with default values matching the OrientationAssessment interface
  const [orientationAssessment, setOrientationAssessment] = useState<MedicalOfficeAssessment.OrientationAssessment>({
    month: false,
    date: false,
    weekday: false,
    year: false,
    time: false,
    score: 0,
  });

  // Load saved data on component mount
  useEffect(() => {
    (async () => {
      const loadedOrientationAssessment = await loadOrientationAssessment();
      if (loadedOrientationAssessment) {
        console.log("Loaded orientation assessment data from storage:", JSON.stringify(loadedOrientationAssessment, null, 2));
        setOrientationAssessment(loadedOrientationAssessment);
      }
    })();
  }, []);

  // Calculate score whenever answers change
  useEffect(() => {
    const newScore = ORIENTATION_QUESTIONS.reduce((sum, q) => 
      sum + (orientationAssessment[q.key as keyof MedicalOfficeAssessment.OrientationAssessment] ? 1 : 0), 0
    );
    setOrientationAssessment(prev => ({ ...prev, score: newScore }));
  }, [orientationAssessment.month, orientationAssessment.date, orientationAssessment.weekday, orientationAssessment.year, orientationAssessment.time]);

  const handleChange = (key: string) => {
    setOrientationAssessment(prev => ({ 
      ...prev, 
      [key]: !prev[key as keyof MedicalOfficeAssessment.OrientationAssessment] 
    }));
  };

  const handleSubmit = async () => {
    try {
      await saveOrientationAssessment(orientationAssessment);
      console.log("Orientation assessment data saved to storage:", JSON.stringify(orientationAssessment, null, 2));
      router.push('/(testing-form)/short-term-memory');
    } catch (e) {
      console.error("Failed to save orientation assessment data", e);
    }
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
              checked={orientationAssessment[q.key as keyof MedicalOfficeAssessment.OrientationAssessment] as boolean}
              onChange={() => handleChange(q.key)}
              style={{ borderBottomWidth: idx === ORIENTATION_QUESTIONS.length - 1 ? 1 : 0 }}
            />
          ))}
        </View>
        <Text style={styles.scoreText}>Оценка ориентации: <Text style={{ fontWeight: 'bold' }}>{orientationAssessment.score}</Text> / 5</Text>
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