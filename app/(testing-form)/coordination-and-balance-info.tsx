import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import LabeledPicker from '@/components/LabeledPicker';
import TextInputField from '@/components/TextInputField';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

export default function CoordinationAndBalanceInfo() {
  const [leg, setLeg] = useState<'right' | 'left' | ''>('');
  const [surface, setSurface] = useState('');
  const [footwear, setFootwear] = useState('');

  const handleSubmit = () => {
    // TODO: Save data if needed
    console.log('coordination-and-balance-info', { leg, surface, footwear });
    router.push('/(testing-form)/coordination-and-balance-mbess');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <LabeledPicker
          label="Тестируемая нога:"
          selectedValue={leg}
          onValueChange={v => setLeg(v as 'right' | 'left' | '')}
          style={{ width: '100%', marginBottom: 0 }}
        >
          <Picker.Item label="Правая" value="right" />
          <Picker.Item label="Левая" value="left" />
        </LabeledPicker>
        <Text style={styles.legNote}>(необходимо тестировать <Text style={{ fontWeight: 'bold' }}>НЕ</Text> доминирующую ногу)</Text>
        <View style={{ width: '100%', marginTop: 18 }}>
          <TextInputField
            label="Поверхность, на которой проводилось тестирование (твердая поверхность, поле и т.п.)"
            placeholder="Укажите поверхность"
            value={surface}
            onChangeText={setSurface}
          />
        </View>
        <View style={{ width: '100%', marginTop: 14 }}>
          <TextInputField
            label="Обувь (спортивная обувь, босиком, брейсы, тейпы и т.п.)"
            placeholder="Укажите обувь"
            value={footwear}
            onChangeText={setFootwear}
          />
        </View>
        <View style={styles.importantBox}>
          <Text style={styles.importantText}>
            <Text style={{ fontWeight: 'bold' }}>ЕСЛИ НЕОБХОДИМО</Text> (в зависимости от клинической картины и возможностей установки): Для дальнейшей оценки можно выполнить те же 3 положения на поверхности из пенопласта средней плотности (например, приблизительно 50 см x 40 см x 6 см) с теми же инструкциями и оценкой.
          </Text>
        </View>
        <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 24, width: '100%' }} />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  legNote: {
    fontSize: 15,
    color: '#222',
    marginLeft: 0,
    marginTop: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  importantBox: {
    backgroundColor: '#f7f7fa',
    borderLeftWidth: 6,
    borderLeftColor: '#888',
    padding: 12,
    marginTop: 24,
    marginBottom: 8,
    width: '100%',
  },
  importantText: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
  },
});