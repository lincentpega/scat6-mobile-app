import CheckboxField from '@/components/CheckboxField';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import type { ImmediateAssessment } from "@/model/ImmediateAssessment";
import { saveMaddocksQuestions, loadMaddocksQuestions } from "@/services/immediateAssessmentStorageService";

const QUESTIONS = [
  { key: 'event', label: 'На каком мероприятии мы сегодня находимся?' },
  { key: 'period', label: 'Какой сейчас тайм?' },
  { key: 'lastScorer', label: 'Кто забил последним в этом матче?' },
  { key: 'teamLastWeek', label: 'За какую команду вы играли на прошлой неделе / игре?' },
  { key: 'teamWin', label: 'Ваша команда выиграла последнюю игру?' },
];

export default function MaddocksQuestions() {
  const [answers, setAnswers] = useState<ImmediateAssessment.MaddocksQuestions>({
    event: false,
    period: false,
    lastScorer: false,
    teamLastWeek: false,
    teamWin: false,
  });

  useEffect(() => {
    (async () => {
      const saved = await loadMaddocksQuestions();
      if (saved) setAnswers(saved);
    })();
  }, []);

  const handleChange = (key: keyof ImmediateAssessment.MaddocksQuestions) => {
    setAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const score = QUESTIONS.reduce((sum, q) => sum + (answers[q.key as keyof ImmediateAssessment.MaddocksQuestions] ? 1 : 0), 0);

  const handleSubmit = async () => {
    await saveMaddocksQuestions(answers);
    router.push('/(testing-form)/symptoms-questionary');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.inputContainer}>
        <Text style={styles.instruction}><Text style={{ fontWeight: 'bold' }}>Скажите:</Text> <Text style={{ fontStyle: 'italic' }}>
          "Я собираюсь задать вам несколько вопросов, пожалуйста, слушайте внимательно и постарайтесь четко отвечать на них. Сначала расскажите мне, что произошло?"
        </Text></Text>
        <Text style={styles.note}>Вопросы могут быть заменены в зависимости от вида спорта.</Text>
        <View style={{ width: '100%', alignItems: 'center' }}>
          {QUESTIONS.map((q, idx) => (
            <CheckboxField
              key={q.key}
              label={q.label}
              checked={answers[q.key as keyof ImmediateAssessment.MaddocksQuestions]}
              onChange={() => handleChange(q.key as keyof ImmediateAssessment.MaddocksQuestions)}
              style={{ borderBottomWidth: idx === QUESTIONS.length - 1 ? 1 : 0 }}
            />
          ))}
        </View>
        <Text style={styles.scoreText}>Сумма баллов по вопросам Мэддокса: <Text style={{ fontWeight: 'bold' }}>{score}</Text> / 5</Text>
        <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 20 }} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  guideText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 15,
    marginBottom: 10,
  },
  note: {
    fontSize: 13,
    color: '#444',
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