import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import InputLabel from '@/components/InputLabel';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

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
  const { updateConcentrationMonths } = useFormContext();
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (success === null) {
      return;
    }
    const data: MedicalOfficeAssessment.ConcentrationMonths = {
      success: success,
    };
    updateConcentrationMonths(data);
    router.push('/(testing-form)/coordination-and-balance-mbess');
  };

  const handleResetConfirmation = () => {
    Alert.alert(
      "Сбросить результат?",
      "Вы уверены, что хотите сбросить выбор и ответить заново?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          onPress: () => setSuccess(null),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Перечисление месяцев в обратном порядке</Text>
        <Text style={styles.instructions}>
          <Text style={{ fontWeight: 'bold' }}>Скажите: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            "Теперь назовите мне месяцы года в обратном порядке, как можно быстрее и точнее. Начните с последнего месяца и двигайтесь в обратном направлении. Итак, вы скажете декабрь, ноябрь… продолжайте."
          </Text>
        </Text>
        <InputLabel label="Правильный порядок:" />
        <View style={styles.monthsList}>
          {MONTHS_REVERSED.map((month, idx) => (
            <Text key={month} style={styles.monthItem}>{month}{idx < MONTHS_REVERSED.length - 1 ? ' – ' : ''}</Text>
          ))}
        </View>

        {success === null ? (
          <View style={styles.attemptButtonsContainer}>
            <SubmitButton text="Успех" onPress={() => setSuccess(true)} style={[styles.attemptButton, styles.successButton]} />
            <SubmitButton text="Провал" onPress={() => setSuccess(false)} style={[styles.attemptButton, styles.failButton]} />
          </View>
        ) : (
          <View style={styles.resultSection}>
             <Text style={styles.resultLabel}>Результат зафиксирован: {success ? 'Успех' : 'Провал'}</Text>
          </View>
        )}
        
        <View style={styles.footerButtonsContainer}>
          <SubmitButton 
            text="Далее" 
            onPress={handleSubmit} 
            style={styles.mainButton}
            disabled={success === null} 
          />
          <SubmitButton 
            text="Сбросить" 
            onPress={handleResetConfirmation} 
            style={[styles.mainButton, styles.resetButton]}
          />
        </View>
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  monthsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  monthItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    paddingHorizontal: 3,
  },
  attemptButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  attemptButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  failButton: {
    backgroundColor: '#F44336',
  },
  resultSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50'
  },
  footerButtonsContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  mainButton: {
    width: '100%',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#E57373',
  },
  submitButton: {
    marginTop: 24,
    width: '80%',
  },
});