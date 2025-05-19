import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import LabeledPicker from '@/components/LabeledPicker';
import CheckboxField from '@/components/CheckboxField';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

const WORD_LISTS = {
  A: [
    'Куртка', 'Стрела', 'Перец', 'Хлопок', 'Кино',
    'Доллар', 'Мёд', 'Зеркало', 'Седло', 'Якорь',
  ],
  B: [
    'Палец', 'Копейка', 'Одеяло', 'Лимон', 'Насекомое',
    'Свеча', 'Бумага', 'Сахар', 'Бутерброд', 'Повозка',
  ],
  C: [
    'Малыш', 'Обезьяна', 'Духи', 'Закат', 'Железо',
    'Локоть', 'Яблоко', 'Ковер', 'Седло', 'Пузырь',
  ],
};

const TRIALS = ['Проба 1', 'Проба 2', 'Проба 3'];

export default function ShortTermMemory() {
  const [selectedList, setSelectedList] = useState<'A' | 'B' | 'C'>('A');
  const [selectedTrial, setSelectedTrial] = useState<number>(0); // 0, 1, 2
  // recalled[trialIdx][wordIdx]
  const [recalled, setRecalled] = useState(
    Array(3).fill(0).map(() => Array(WORD_LISTS['A'].length).fill(false))
  );

  const handleListChange = (itemValue: string | number) => {
    const v = String(itemValue);
    setSelectedList(v as 'A' | 'B' | 'C');
    setSelectedTrial(0);
    setRecalled(Array(3).fill(0).map(() => Array(WORD_LISTS[v as 'A' | 'B' | 'C'].length).fill(false)));
  };

  const handleCheck = (trialIdx: number, wordIdx: number) => {
    setRecalled(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[trialIdx][wordIdx] = !updated[trialIdx][wordIdx];
      console.log(updated);
      console.log(trialIdx)
      return updated;
    });
  };

  const handleSubmit = () => {
    router.push('/(testing-form)/concentration-numbers');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <Text style={styles.header}>Кратковременная память</Text>
        <Text style={styles.instructions}>
          Все 3 пробы должны быть выполнены независимо от номера, указанного в первой пробе. Проводите оценку со скоростью одно слово в секунду.{"\n\n"}
          <Text style={{ fontWeight: 'bold' }}>Проба 1:</Text> Скажите: "Я собираюсь проверить вашу память. Я зачитаю Вам список слов, и, когда я закончу, повторите столько слов, сколько сможете запомнить, в любом порядке."{"\n\n"}
          <Text style={{ fontWeight: 'bold' }}>Пробы 2 и 3:</Text> Скажите: "Я собираюсь повторить тот же список. Повторите столько слов, сколько сможете запомнить, в любом порядке, даже если вы произносили это слово раньше в предыдущем испытании."
        </Text>
        <LabeledPicker
          label="Выберите список слов"
          selectedValue={selectedList}
          onValueChange={handleListChange}
          style={{ width: '100%', marginVertical: 12 }}
        >
          <Picker.Item label="A" value="A" />
          <Picker.Item label="B" value="B" />
          <Picker.Item label="C" value="C" />
        </LabeledPicker>
        <LabeledPicker
          label="Проба"
          selectedValue={selectedTrial.toString()}
          onValueChange={v => setSelectedTrial(Number(v))}
          style={{ width: '100%', marginBottom: 16 }}
        >
          {TRIALS.map((trial, idx) => (
            <Picker.Item key={trial} label={trial} value={`${idx}`} />
          ))}
        </LabeledPicker>
        <View style={styles.wordsList}>
          {WORD_LISTS[selectedList].map((word, wordIdx) => (
            <CheckboxField
              key={word}
              label={word}
              checked={recalled[selectedTrial][wordIdx]}
              onChange={() => handleCheck(selectedTrial, wordIdx)}
              style={[
                styles.checkboxRow,
                { borderBottomWidth: wordIdx === WORD_LISTS[selectedList].length - 1 ? 1 : 0 }
              ]}
            />
          ))}
        </View>
        <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 24 }} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  instructions: {
    fontSize: 14,
    marginBottom: 18,
    color: '#333',
    alignSelf: 'flex-start',
  },
  wordsList: {
    width: '100%',
    marginBottom: 10,
  },
  checkboxRow: {
    borderBottomWidth: 0,
  },
});
