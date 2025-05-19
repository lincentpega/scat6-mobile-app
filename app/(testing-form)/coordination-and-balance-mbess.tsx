import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import TextInputField from '@/components/TextInputField';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function CoordinationAndBalanceMBESS() {
  // Main mBESS
  const [doubleLeg, setDoubleLeg] = useState('');
  const [tandem, setTandem] = useState('');
  const [singleLeg, setSingleLeg] = useState('');
  // Foam (optional)
  const [foamDoubleLeg, setFoamDoubleLeg] = useState('');
  const [foamTandem, setFoamTandem] = useState('');
  const [foamSingleLeg, setFoamSingleLeg] = useState('');

  // Validation function for inputs with max 10
  const validateMaxTen = (value: string, setter: (value: string) => void) => {
    const numValue = parseInt(value);
    if (value === '') {
      setter('');
    } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
      setter(numValue.toString());
    }
  };

  // Calculate totals
  const total = [doubleLeg, tandem, singleLeg].reduce((sum, v) => sum + (parseInt(v) || 0), 0);
  const foamTotal = [foamDoubleLeg, foamTandem, foamSingleLeg].reduce((sum, v) => sum + (parseInt(v) || 0), 0);

  const handleSubmit = () => {
    // TODO: Save or process results
    router.push('/(testing-form)/tandem-walk');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <Text style={styles.header}>mBESS (по 20 секунд каждый)</Text>
        
        <View style={styles.inputField}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInputField
                label="Пациент стоит на двух ногах"
                placeholder=""
                value={doubleLeg}
                onChangeText={(value) => validateMaxTen(value, setDoubleLeg)}
                keyboardType="number-pad"
              />
            </View>
            <Text style={styles.scoreLabel}>из 10</Text>
          </View>
        </View>

        <View style={styles.inputField}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInputField
                label="Тандемная позиция"
                placeholder=""
                value={tandem}
                onChangeText={(value) => validateMaxTen(value, setTandem)}
                keyboardType="number-pad"
              />
            </View>
            <Text style={styles.scoreLabel}>из 10</Text>
          </View>
        </View>

        <View style={styles.inputField}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInputField
                label="Пациент стоит на одной ноге"
                placeholder=""
                value={singleLeg}
                onChangeText={(value) => validateMaxTen(value, setSingleLeg)}
                keyboardType="number-pad"
              />
            </View>
            <Text style={styles.scoreLabel}>из 10</Text>
          </View>
        </View>

        <View style={styles.inputField}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInputField
                label="Общее количество отклонений"
                placeholder=""
                value={total.toString()}
                onChangeText={() => {}}
                editable={false}
                style={styles.totalInput}
              />
            </View>
            <Text style={styles.scoreLabel}>из 30</Text>
          </View>
        </View>

        <View style={styles.optionalSection}>
          <Text style={styles.foamHeader}>На пенопласте (опционально)</Text>
          
          <View style={styles.inputField}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInputField
                  label="Пациент стоит на двух ногах"
                  placeholder=""
                  value={foamDoubleLeg}
                  onChangeText={(value) => validateMaxTen(value, setFoamDoubleLeg)}
                  keyboardType="number-pad"
                />
              </View>
              <Text style={styles.scoreLabel}>из 10</Text>
            </View>
          </View>

          <View style={styles.inputField}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInputField
                  label="Тандемная позиция"
                  placeholder=""
                  value={foamTandem}
                  onChangeText={(value) => validateMaxTen(value, setFoamTandem)}
                  keyboardType="number-pad"
                />
              </View>
              <Text style={styles.scoreLabel}>из 10</Text>
            </View>
          </View>

          <View style={styles.inputField}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInputField
                  label="Пациент стоит на одной ноге"
                  placeholder=""
                  value={foamSingleLeg}
                  onChangeText={(value) => validateMaxTen(value, setFoamSingleLeg)}
                  keyboardType="number-pad"
                />
              </View>
              <Text style={styles.scoreLabel}>из 10</Text>
            </View>
          </View>

          <View style={styles.inputField}>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInputField
                  label="Общее количество отклонений"
                  placeholder=""
                  value={foamTotal.toString()}
                  onChangeText={() => {}}
                  editable={false}
                  style={styles.totalInput}
                />
              </View>
              <Text style={styles.scoreLabel}>из 30</Text>
            </View>
          </View>
        </View>

        <View style={styles.notesBlock}>
          <Text style={styles.note}><Text style={{ fontWeight: 'bold' }}>Примечание:</Text> Если mBESS дает нормальные результаты, переходите к <Text style={{ fontWeight: 'bold' }}>тандемной походке/тандемной походке с двойным заданием</Text>.</Text>
          <Text style={styles.note}>Если mBESS выявляет аномальные результаты или клинически значимые трудности, в <Text style={{ fontWeight: 'bold' }}>тандемной походке</Text> на данный момент нет необходимости.</Text>
          <Text style={styles.note}>Как <Text style={{ fontWeight: 'bold' }}>тандемная походка</Text>, так и дополнительный компонент <Text style={{ fontWeight: 'bold' }}>двойной задачи</Text> могут быть применены позже по мере необходимости.</Text>
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  inputField: {
    width: '100%',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    minHeight: 70,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    width: 50,
    marginTop: 35,
  },
  totalInput: {
    backgroundColor: '#f5f5f5',
  },
  optionalSection: {
    width: '100%',
    backgroundColor: '#fff5eb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  foamHeader: {
    fontWeight: 'bold',
    color: '#a05a00',
    fontSize: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  notesBlock: {
    width: '100%',
    marginBottom: 8,
  },
  note: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
  },
});