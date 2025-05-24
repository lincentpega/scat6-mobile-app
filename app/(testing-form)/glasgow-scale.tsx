import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import type { ImmediateAssessment } from "@/model/ImmediateAssessment";
import { saveGlasgowScale, loadGlasgowScale } from "@/services/immediateAssessmentStorageService";

const EYE_RESPONSES = [
  { label: 'Глаза не открываются', value: 'none' },
  { label: 'Глаза реагируют на болевое', value: 'pain' },
  { label: 'Глаза реагируют на вербальный стимул', value: 'verbal' },
  { label: 'Глаза открываются произвольно', value: 'spontaneous' },
];

const VERBAL_RESPONSES = [
  { label: 'Речь отсутствует', value: 'none' },
  { label: 'Нечленораздельные звуки', value: 'sounds' },
  { label: 'Бессвязные слова', value: 'words' },
  { label: 'Спутанная речь', value: 'confused' },
  { label: 'Больной ориентирован, речь в норме', value: 'oriented' },
];

const MOTOR_RESPONSES = [
  { label: 'Двигательная реакция отсутствует', value: 'none' },
  { label: 'Патологическое разгибание в ответ на болевое раздражение', value: 'extension' },
  { label: 'Патологическое сгибание в ответ на болевое раздражение', value: 'flexion' },
  { label: 'Отдергивание конечности в ответ на болевое раздражение', value: 'withdrawal' },
  { label: 'Целенаправленное движение в ответ на болевое раздражение', value: 'purposeful' },
  { label: 'Выполнение движений по команде', value: 'obeys' },
];

function RoundButtonGroup({ options, value, onChange }: { options: { label: string, value: string }[], value: string, onChange: (v: string) => void }) {
  return (
    <View style={styles.buttonGroup}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[styles.roundButton, value === option.value && styles.roundButtonSelected]}
          onPress={() => onChange(option.value)}
        >
          <Text style={[styles.roundButtonText, value === option.value && styles.roundButtonTextSelected]}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function GlasgowScale() {
  const [answers, setAnswers] = useState<ImmediateAssessment.GlasgowScale>({
    eye: EYE_RESPONSES[0].value,
    verbal: VERBAL_RESPONSES[0].value,
    motor: MOTOR_RESPONSES[0].value,
  });

  useEffect(() => {
    (async () => {
      const saved = await loadGlasgowScale();
      if (saved) setAnswers(saved);
    })();
  }, []);

  const handleSubmit = async () => {
    await saveGlasgowScale(answers);
    router.push('/(testing-form)/maddocks-questions');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.inputContainer}>
        <Text style={styles.sectionLabel}>Зрительная реакция (E)</Text>
        <RoundButtonGroup options={EYE_RESPONSES} value={answers.eye} onChange={(value) => setAnswers(prev => ({ ...prev, eye: value }))} />
        <Text style={styles.sectionLabel}>Речевая реакция (V)</Text>
        <RoundButtonGroup options={VERBAL_RESPONSES} value={answers.verbal} onChange={(value) => setAnswers(prev => ({ ...prev, verbal: value }))} />
        <Text style={styles.sectionLabel}>Двигательная реакция (M)</Text>
        <RoundButtonGroup options={MOTOR_RESPONSES} value={answers.motor} onChange={(value) => setAnswers(prev => ({ ...prev, motor: value }))} />
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
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 10,
  },
  roundButton: {
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 4,
  },
  roundButtonSelected: {
    borderColor: '#1A1A1A',
    backgroundColor: '#E6E6E6',
  },
  roundButtonText: {
    color: '#222',
    fontSize: 15,
  },
  roundButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
}); 