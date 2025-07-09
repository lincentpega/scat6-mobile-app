import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import { saveMedicalOfficeAssessment } from '@/services/medicalOfficeAssessmentStorageService';
import { useAthleteContext } from '@/contexts/AthleteContext';
import { router } from 'expo-router';
import type { WordListKey } from '@/constants/app-types';

const WORD_LISTS = {
  A: ['Куртка', 'Стрела', 'Перец', 'Хлопок', 'Кино', 'Доллар', 'Мёд', 'Зеркало', 'Седло', 'Якорь'],
  B: ['Палец', 'Копейка', 'Одеяло', 'Лимон', 'Насекомое', 'Свеча', 'Бумага', 'Сахар', 'Бутерброд', 'Повозка'],
  C: ['Малыш', 'Обезьяна', 'Духи', 'Закат', 'Железо', 'Локоть', 'Яблоко', 'Ковер', 'Седло', 'Пузырь'],
};
const LIST_LABELS = ['A', 'B', 'C'] as const;

export default function DeferredMemory() {
  const { medicalOfficeAssessment, updateDeferredMemory, clearMedicalOfficeAssessment, setIsFormActive } = useFormContext();
  const selectedList: WordListKey = medicalOfficeAssessment.shortTermMemory?.list ?? 'A';
  const [answers, setAnswers] = useState<boolean[]>(Array(10).fill(false));
  const [currentStartTime, setCurrentStartTime] = useState('');
  const { athleteId, athleteTmpFullName, setAthleteId, setAthleteTmpFullName } = useAthleteContext();


  useEffect(() => {
    const newStartTime = new Date().toISOString();
    setCurrentStartTime(newStartTime);

    if (medicalOfficeAssessment.deferredMemory) {
      const { result: contextResult } = medicalOfficeAssessment.deferredMemory;
      const newAnswers = Array(10).fill(false);
      if (typeof contextResult === 'number' && contextResult >= 0 && contextResult <= 10) {
        for (let i = 0; i < contextResult; i++) {
          newAnswers[i] = true;
        }
      }
      setAnswers(newAnswers);
    }
  }, []);

  const handleCheckbox = (idx: number) => {
    setAnswers(prev => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const result = answers.filter(Boolean).length;

  const handleSubmit = () => {
    const deferredMemoryData: MedicalOfficeAssessment.DeferredMemory = {
      startTime: new Date(currentStartTime),
      list: selectedList,
      result: result,
    };

    const assessmentToSave: Partial<MedicalOfficeAssessment> = {
      ...medicalOfficeAssessment,
      deferredMemory: deferredMemoryData,
      sportsmanId: athleteId ?? undefined,
      athleteTmpFullName: athleteTmpFullName ?? undefined,
    };

    saveMedicalOfficeAssessment(assessmentToSave).then(() => {
      console.log('Saved assessment:', assessmentToSave);
      clearMedicalOfficeAssessment();
      setIsFormActive(false);
      setAthleteId(null);
      setAthleteTmpFullName(null);
      router.navigate('/(drafts)');
    });
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start', backgroundColor: '#fff', minHeight: '100%' }}>
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Отсроченное запоминание следует выполнять по истечении не менее 5 минут с момента окончания раздела "Кратковременная память":{"\n"}
          <Text style={{ fontWeight: 'bold' }}>Набирайте 1 балл за каждый правильный ответ.</Text>{"\n"}
          <Text style={{ fontWeight: 'bold' }}>Скажите:</Text> "Помните тот список слов, который я читал ранее? Назовите столько слов из списка, сколько сможете вспомнить, в любом порядке."
        </Text>
        <View style={styles.row}>
          <Text style={styles.inputLabel}>Используется список слов:</Text>
          <View style={styles.listBadge}>
            <Text style={styles.listBadgeText}>{selectedList}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Список {selectedList}</Text>
            <Text style={styles.tableHeaderCell}>Проба</Text>
          </View>
          {WORD_LISTS[selectedList].map((word: string, idx: number) => (
            <View key={word} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{word}</Text>
              <View style={styles.tableCell}>
                <BouncyCheckbox
                  isChecked={answers[idx]}
                  onPress={() => handleCheckbox(idx)}
                  fillColor="#000"
                  unFillColor="#fff"
                  size={22}
                  iconStyle={{ borderColor: '#000', borderRadius: 6 }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 6 }}
                  style={{ alignSelf: 'center', width: 22 }}
                />
              </View>
            </View>
          ))}
          <View style={styles.tableFooterRow}>
            <Text style={[styles.tableFooterCell, { flex: 2 }]}>Результат</Text>
            <Text style={styles.tableFooterCell}>{result}</Text>
          </View>
        </View>
        <SubmitButton text="Завершить тест" onPress={handleSubmit} style={{ marginTop: 24, width: '100%' }} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#2f2d51',
  },
  instructions: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#222',
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    backgroundColor: '#fff',
    minWidth: 70,
  },
  listBadge: {
    backgroundColor: '#2f2d51',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  listBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#2f2d51',
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#f7f7fa',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
  },
  tableFooterRow: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tableFooterCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});