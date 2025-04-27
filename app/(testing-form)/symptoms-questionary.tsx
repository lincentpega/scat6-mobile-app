import ScrollViewKeyboardAwareContainer from '@/components/Container';
import InputLabel from '@/components/InputLabel';
import TextInputField from '@/components/TextInputField';
import SubmitButton from '@/components/SubmitButton';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

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
  { key: 'physical', label: 'Ухудшается ли ваше состояние в результате физических нагрузок?' },
  { key: 'mental', label: 'Ухудшается ли ваше состояние в результате умственной деятельности?' },
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
  // Initialize state
  const [scores, setScores] = useState<Record<string, number>>(() => 
    Object.fromEntries(SYMPTOMS.map(s => [s.id, 0]))
  );
  
  const [yesNo, setYesNo] = useState<Record<string, boolean | null>>(() => 
    Object.fromEntries(YES_NO_QUESTIONS.map(q => [q.key, null]))
  );
  
  const [percent, setPercent] = useState<string>('');
  const [not100Reason, setNot100Reason] = useState<string>('');

  // Update symptom score
  const handleScoreChange = (id: string, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  // Update yes/no answer
  const handleYesNoChange = (key: string, value: boolean) => {
    setYesNo(prev => ({ ...prev, [key]: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log({ scores, yesNo, percent, not100Reason });
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
                value={scores[symptom.id]} 
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
                value={yesNo[q.key]} 
                onChange={(value) => handleYesNoChange(q.key, value)} 
              />
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <InputLabel label="Если считать 100% абсолютно нормальным показателем, то на сколько вы оцениваете свое самочувствие в процентах?" />
          <TextInputField
            placeholder="Введите процент (например, 80)"
            value={percent}
            onChangeText={setPercent}
            keyboardType="numeric"
            style={{ marginBottom: 10 }}
          />
          
          <InputLabel label="Если не на 100%, то почему?" />
          <TextInputField
            placeholder="Опишите причину..."
            value={not100Reason}
            onChangeText={setNot100Reason}
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