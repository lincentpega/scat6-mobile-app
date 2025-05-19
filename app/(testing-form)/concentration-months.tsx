import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import LabeledPicker from '@/components/LabeledPicker';
import SubmitButton from '@/components/SubmitButton';
import InputLabel from '@/components/InputLabel';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import Timer from '@/components/Timer';

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

export default function ConcentrationMonths() {
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState('0');

  const timeNum = parseInt(time, 10);
  const errorsNum = parseInt(errors, 10);
  const result = (!isNaN(timeNum) && !isNaN(errorsNum) && errorsNum === 0 && timeNum < 30) ? 1 : 0;

  const handleSubmit = () => {
    // TODO: Save result or navigate as needed
    router.push('/(testing-form)/coordination-and-balance-info');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <Text style={styles.header}>Перечисление месяцев в обратном порядке</Text>
        <Text style={styles.instructions}>
          <Text style={{ fontWeight: 'bold' }}>Скажите: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            "Теперь назовите мне месяцы года в обратном порядке, как можно быстрее и точнее. Начните с последнего месяца и двигайтесь в обратном направлении. Итак, вы скажете декабрь, ноябрь… продолжайте. Я засеку время".
          </Text>
        </Text>
        <InputLabel label="Правильный порядок:" />
        <View style={styles.monthsList}>
          {MONTHS_REVERSED.map((month, idx) => (
            <Text key={month} style={styles.monthItem}>{month}{idx < MONTHS_REVERSED.length - 1 ? ' – ' : ''}</Text>
          ))}
        </View>
        <Timer onChange={sec => setTime(sec.toString())} style={{ alignSelf: 'center', marginBottom: 10 }} />
        <View style={styles.inputRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputLabel label="Время (секунды)" />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={time}
              onChangeText={setTime}
              placeholder="0"
              maxLength={3}
            />
          </View>
          <View style={{ flex: 1 }}>
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
        </View>
        <Text style={styles.resultText}>Результат: <Text style={{ fontWeight: 'bold' }}>{result}</Text> из 1</Text>
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
  monthsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  monthItem: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#444',
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f7f7fa',
    width: '100%',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});