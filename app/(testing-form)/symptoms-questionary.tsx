import ScrollViewKeyboardAwareContainer from '@/components/Container';
import InputLabel from '@/components/InputLabel';
import TextInputField from '@/components/TextInputField';
import SubmitButton from '@/components/SubmitButton';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import { useFormContext } from '@/contexts/FormContext';

interface Symptom {
  id: string;
  label: string;
}

interface YesNoQuestion {
  key: string;
  label: string;
}

const SYMPTOMS: Symptom[] = [
  { id: 'headache', label: 'Головные боли' },
  { id: 'headPressure', label: '«Давление в голове»' },
  { id: 'neckPain', label: 'Боль в области шеи' },
  { id: 'nausea', label: 'Тошнота или рвота' },
  { id: 'dizziness', label: 'Головокружение' },
  { id: 'blurredVision', label: 'Нечеткое зрение' },
  { id: 'balance', label: 'Дисбаланс' },
  { id: 'lightSensitivity', label: 'Чувствительность к свету' },
  { id: 'noiseSensitivity', label: 'Чувствительность к громким звукам' },
  { id: 'slowness', label: 'Ощущение заторможенности' },
  { id: 'foggy', label: 'Ощущение «как в тумане»' },
  { id: 'notRight', label: 'Такое чувство, что «что-то не так»' },
  { id: 'concentration', label: 'Трудности с концентрацией внимания' },
  { id: 'memory', label: 'Трудности с запоминанием' },
  { id: 'fatigue', label: 'Усталость, упадок сил' },
  { id: 'confusion', label: 'Путаное сознание' },
  { id: 'drowsiness', label: 'Сонливость' },
  { id: 'emotionality', label: 'Повышенная эмоциональность' },
  { id: 'irritability', label: 'Раздражительность' },
  { id: 'depression', label: 'Подавленность' },
  { id: 'anxiety', label: 'Нервозность или обеспокоенность' },
  { id: 'sleepIssues', label: 'Проблемы со сном (если применимо)' },
];

const YES_NO_QUESTIONS: YesNoQuestion[] = [
  { key: 'worseAfterPhysicalActivity', label: 'Ухудшается ли ваше состояние в результате физических нагрузок?' },
  { key: 'worseAfterMentalActivity', label: 'Ухудшается ли ваше состояние в результате умственной деятельности?' },
];

function ScoreButtonGroup({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <View style={styles.scoreButtonGroup}>
      {[0, 1, 2, 3, 4, 5, 6].map((score) => (
        <TouchableOpacity
          key={score}
          style={[styles.scoreButton, value === score && styles.scoreButtonSelected]}
          onPress={() => onChange(score)}
        >
          <Text style={[styles.scoreButtonText, value === score && styles.scoreButtonTextSelected]}>
            {score}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function YesNoButtonGroup({ value, onChange }: { value: boolean | null; onChange: (value: boolean) => void }) {
  return (
    <View style={styles.yesNoButtonGroup}>
      <TouchableOpacity
        style={[styles.yesNoButton, value === true && styles.yesNoButtonSelected]}
        onPress={() => onChange(true)}
      >
        <Text style={[styles.yesNoButtonText, value === true && styles.yesNoButtonTextSelected]}>Да</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.yesNoButton, value === false && styles.yesNoButtonSelected]}
        onPress={() => onChange(false)}
      >
        <Text style={[styles.yesNoButtonText, value === false && styles.yesNoButtonTextSelected]}>Нет</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SymptomsQuestionary() {
  const { medicalOfficeAssessment, updateSymptoms, updateSymptomsDetails } = useFormContext();
  const [symptoms, setSymptoms] = useState<MedicalOfficeAssessment.Symptoms>({
    headache: 0,
    headPressure: 0,
    neckPain: 0,
    nausea: 0,
    dizziness: 0,
    blurredVision: 0,
    balance: 0,
    lightSensitivity: 0,
    noiseSensitivity: 0,
    slowness: 0,
    foggy: 0,
    notRight: 0,
    concentration: 0,
    memory: 0,
    fatigue: 0,
    confusion: 0,
    drowsiness: 0,
    emotionality: 0,
    irritability: 0,
    depression: 0,
    anxiety: 0,
    sleepIssues: 0,
  });
  const [symptomsDetails, setSymptomsDetails] = useState<MedicalOfficeAssessment.SymptomsDetails>({
    worseAfterPhysicalActivity: false,
    worseAfterMentalActivity: false,
    wellnessPercent: 100,
    not100Reason: '',
  });

  useEffect(() => {
    if (medicalOfficeAssessment.symptoms) {
      setSymptoms(medicalOfficeAssessment.symptoms);
    }
    if (medicalOfficeAssessment.symptomsDetails) {
      setSymptomsDetails(medicalOfficeAssessment.symptomsDetails);
    }
  }, [medicalOfficeAssessment.symptoms, medicalOfficeAssessment.symptomsDetails]);

  const handleScoreChange = (id: string, value: number) => {
    setSymptoms(prev => ({ ...prev, [id]: value }));
  };

  const handleYesNoChange = (key: string, value: boolean) => {
    setSymptomsDetails(prev => ({ ...prev, [key]: value }));
  };

  const handlePercentChange = (text: string) => {
    const numericValue = parseInt(text) || 0;
    setSymptomsDetails(prev => ({ ...prev, wellnessPercent: numericValue }));
  };

  const handleNot100ReasonChange = (text: string) => {
    setSymptomsDetails(prev => ({ ...prev, not100Reason: text }));
  };

  const handleSubmit = () => {
    updateSymptoms(symptoms);
    updateSymptomsDetails(symptomsDetails);
    router.push('/(testing-form)/orientation-assessment');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Пожалуйста, передайте опросник спортсмену</Text>
        <View style={styles.symptomsContainer}>
          {SYMPTOMS.map((symptom) => (
            <View key={symptom.id} style={styles.symptomRow}>
              <InputLabel label={symptom.label} />
              <ScoreButtonGroup 
                value={symptoms[symptom.id as keyof MedicalOfficeAssessment.Symptoms] as number} 
                onChange={(value) => handleScoreChange(symptom.id, value)} 
              />
            </View>
          ))}
        </View>
        <View style={styles.section}>
          {YES_NO_QUESTIONS.map((q) => (
            <View key={q.key} style={styles.yesNoRow}>
              <InputLabel label={q.label} />
              <YesNoButtonGroup 
                value={symptomsDetails[q.key as keyof MedicalOfficeAssessment.SymptomsDetails] as boolean} 
                onChange={(value) => handleYesNoChange(q.key, value)} 
              />
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <InputLabel label="Если считать 100% абсолютно нормальным показателем, то на сколько вы оцениваете свое самочувствие в процентах?" />
          <TextInputField
            placeholder="Введите процент (например, 80)"
            value={symptomsDetails.wellnessPercent.toString()}
            onChangeText={handlePercentChange}
            keyboardType="numeric"
            style={{ marginBottom: 10 }}
          />
          <InputLabel label="Если не на 100%, то почему?" />
          <TextInputField
            placeholder="Опишите причину..."
            value={symptomsDetails.not100Reason ?? ''}
            onChangeText={(text) => handleNot100ReasonChange(text)}
            multiline
            numberOfLines={3}
            style={{ height: 80 }}
          />
        </View>
        <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 20 }} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },
  symptomsContainer: {
    width: '100%',
  },
  section: {
    marginTop: 24,
    width: '100%',
  },
  symptomRow: {
    width: '100%',
    marginBottom: 16,
  },
  scoreButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  scoreButton: {
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    minWidth: 32,
  },
  scoreButtonSelected: {
    borderColor: '#1A1A1A',
    backgroundColor: '#E6E6E6',
  },
  scoreButtonText: {
    color: '#222',
    fontSize: 16,
  },
  scoreButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  yesNoRow: {
    width: '100%',
    marginBottom: 16,
  },
  yesNoButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  yesNoButton: {
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    minWidth: 56,
  },
  yesNoButtonSelected: {
    borderColor: '#1A1A1A',
    backgroundColor: '#E6E6E6',
  },
  yesNoButtonText: {
    color: '#222',
    fontSize: 16,
  },
  yesNoButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
});