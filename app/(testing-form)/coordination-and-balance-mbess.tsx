import React, { useState, useEffect } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import TimedClickerField from '@/components/TimedClickerField';
import TextInputField from '@/components/TextInputField';
import LabeledPicker from '@/components/LabeledPicker';
import { Picker } from '@react-native-picker/picker';

const MBESS_TIMER_DURATION = 20;
const MAX_ERRORS = 10;
const SOUND_INTERVAL = 20;

const STEP_INFO = 1;
const STEP_DOUBLE_LEG = 2;
const STEP_TANDEM = 3;
const STEP_SINGLE_LEG = 4;
const STEP_RESULTS = 5;

export default function CoordinationAndBalanceTestScreen() {
  const { medicalOfficeAssessment, updateMbessTest } = useFormContext();
  const [currentStep, setCurrentStep] = useState(STEP_INFO);

  // Step 1: Info state
  const [leg, setLeg] = useState<'right' | 'left' | ''>(
    medicalOfficeAssessment.mbessTest?.legTested || 'right'
  );
  const [testType, setTestType] = useState<'foam' | 'otherSurface' | ''>(() => {
    // Use mbessTest.type if available
    if (medicalOfficeAssessment.mbessTest?.type === 'styrofoam') {
      return 'foam';
    }
    if (medicalOfficeAssessment.mbessTest?.type === 'casual') {
      return 'otherSurface';
    }
    // Fallback to surface determination
    if (medicalOfficeAssessment.mbessTest?.surface === 'foam') {
      return 'foam';
    }
    if (medicalOfficeAssessment.mbessTest?.surface && medicalOfficeAssessment.mbessTest.surface !== 'foam') {
      return 'otherSurface';
    }
    return 'foam';
  });
  const [surfaceDescription, setSurfaceDescription] = useState(
    medicalOfficeAssessment.mbessTest?.surface === 'foam' ? '' : medicalOfficeAssessment.mbessTest?.surface || ''
  );
  const [footwear, setFootwear] = useState(
     medicalOfficeAssessment.mbessTest?.footwear || ''
  );

  // Individual test error counts
  const [doubleLegErrors, setDoubleLegErrors] = useState(0);
  const [tandemErrors, setTandemErrors] = useState(0);
  const [singleLegErrors, setSingleLegErrors] = useState(0);

  // Load existing test results when component mounts
  useEffect(() => {
    if (medicalOfficeAssessment.mbessTest) {
      // If data exists in context, populate local state
      setLeg(medicalOfficeAssessment.mbessTest.legTested || 'right');
      setTestType(medicalOfficeAssessment.mbessTest.type === 'styrofoam' ? 'foam' : 'otherSurface');
      setSurfaceDescription(medicalOfficeAssessment.mbessTest.type === 'styrofoam' ? '' : medicalOfficeAssessment.mbessTest.surface || '');
      setFootwear(medicalOfficeAssessment.mbessTest.footwear || '');
      setDoubleLegErrors(medicalOfficeAssessment.mbessTest.standsOnBothFeet || 0);
      setTandemErrors(medicalOfficeAssessment.mbessTest.tandemPosition || 0);
      setSingleLegErrors(medicalOfficeAssessment.mbessTest.standsOnOneFeet || 0);
    } else {
      // Default local state if no data in context (e.g., new form or after a full reset clears context)
      setLeg('right');
      setTestType('foam'); 
      setSurfaceDescription('');
      setFootwear('');
      setDoubleLegErrors(0);
      setTandemErrors(0);
      setSingleLegErrors(0);
    }
  }, [medicalOfficeAssessment.mbessTest]);

  const handleNextToMbessSteps = () => {
    if (leg && testType) {
      if (testType === 'otherSurface' && !surfaceDescription) {
        Alert.alert('Пожалуйста, укажите поверхность для тестирования.');
        return;
      }
      setCurrentStep(STEP_DOUBLE_LEG);
    } else {
      Alert.alert('Пожалуйста, заполните все обязательные поля.');
    }
  };

  const handleNextStep = () => {
    if (currentStep < STEP_RESULTS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleResetAllMbessTests = () => {
    Alert.alert(
      "Сбросить весь тест?",
      "Вы уверены, что хотите сбросить ВСЮ информацию (включая ногу, тип теста, поверхность, обувь и все ошибки) и начать тестирование координации с самого начала?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Сбросить всё",
          onPress: () => {
            // Reset all relevant local states to their initial defaults
            setLeg('right'); 
            setTestType('foam'); // This will also trigger surfaceDescription to be '' if foam is selected
            setSurfaceDescription(''); 
            setFootwear('');
            setDoubleLegErrors(0);
            setTandemErrors(0);
            setSingleLegErrors(0);
            
            // Reset mbessTest in the context to its default state
            updateMbessTest({ 
              legTested: 'right', 
              surface: 'foam', 
              footwear: '', 
              type: 'styrofoam', 
              standsOnBothFeet: 0, 
              tandemPosition: 0, 
              standsOnOneFeet: 0 
            });
            setCurrentStep(STEP_INFO); 
          },
          style: "destructive"
        }
      ]
    );
  };

  const saveCurrentTestResults = () => {
    const mbessTestToSave: MedicalOfficeAssessment.MbessTest = {
      legTested: leg,
      surface: testType === 'foam' ? 'foam' : surfaceDescription,
      footwear: footwear,
      type: testType === 'foam' ? 'styrofoam' : 'casual',
      standsOnBothFeet: doubleLegErrors,
      tandemPosition: tandemErrors,
      standsOnOneFeet: singleLegErrors,
    };
    
    updateMbessTest(mbessTestToSave);
  };

  const handleFinalSubmit = () => {
    saveCurrentTestResults();
    router.push('/(testing-form)/tandem-walk');
  };

  const totalErrors = doubleLegErrors + tandemErrors + singleLegErrors;

  const renderInfoStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>Информация о тесте координации и баланса</Text>
      <LabeledPicker
        label="Тестируемая нога:"
        selectedValue={leg}
        onValueChange={(itemValue) => setLeg(itemValue as 'right' | 'left' | '')}
        style={{ width: '100%', marginBottom: 0 }}
      >
        <Picker.Item label="Правая" value="right" />
        <Picker.Item label="Левая" value="left" />
      </LabeledPicker>
      <Text style={styles.legNote}>(необходимо тестировать <Text style={{ fontWeight: 'bold' }}>НЕ</Text> доминирующую ногу)</Text>
      
      <LabeledPicker
        label="Тип теста:"
        selectedValue={testType}
        onValueChange={(itemValue) => {
          setTestType(itemValue as 'foam' | 'otherSurface' | '');
          if (itemValue === 'foam') {
            setSurfaceDescription('');
          }
        }}
        style={{ width: '100%', marginTop: 18 }}
      >
        <Picker.Item label="На пенопласте" value="foam" />
        <Picker.Item label="На другой поверхности" value="otherSurface" />
      </LabeledPicker>

      {testType === 'otherSurface' && (
        <View style={{ width: '100%', marginTop: 18 }}>
          <TextInputField
            label="Поверхность, на которой проводилось тестирование (твердая поверхность, поле и т.п.)"
            placeholder="Укажите поверхность"
            value={surfaceDescription}
            onChangeText={setSurfaceDescription}
          />
        </View>
      )}
      <View style={{ width: '100%', marginTop: 14 }}>
        <TextInputField
          label="Обувь (спортивная обувь, босиком, брейсы, тейпы и т.п.)"
          placeholder="Укажите обувь"
          value={footwear}
          onChangeText={setFootwear}
        />
      </View>
      <SubmitButton text="Начать тест" onPress={handleNextToMbessSteps} style={{ marginTop: 24, width: '100%' }} />
    </View>
  );

  const renderDoubleLegStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>
        mBESS: Пациент стоит на двух ногах ({testType === 'foam' ? 'на пенопласте' : 'на обычной поверхности'})
      </Text>
      <Text style={styles.stepDescription}>
        Тест {MBESS_TIMER_DURATION} секунд. Считайте количество ошибок баланса.
      </Text>
      
      <TimedClickerField
        label="Пациент стоит на двух ногах"
        errorCount={doubleLegErrors}
        onErrorChange={setDoubleLegErrors}
        maxErrors={MAX_ERRORS}
        timerDuration={MBESS_TIMER_DURATION}
        soundIntervalSeconds={SOUND_INTERVAL}
      />

      <View style={styles.buttonContainerSingle}>
        <SubmitButton 
          text="Далее" 
          onPress={handleNextStep} 
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  const renderTandemStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>
        mBESS: Тандемная позиция ({testType === 'foam' ? 'на пенопласте' : 'на обычной поверхности'})
      </Text>
      <Text style={styles.stepDescription}>
        Тест {MBESS_TIMER_DURATION} секунд. Считайте количество ошибок баланса.
      </Text>
      
      <TimedClickerField
        label="Тандемная позиция"
        errorCount={tandemErrors}
        onErrorChange={setTandemErrors}
        maxErrors={MAX_ERRORS}
        timerDuration={MBESS_TIMER_DURATION}
        soundIntervalSeconds={SOUND_INTERVAL}
      />

      <View style={styles.buttonContainerSingle}>
        <SubmitButton 
          text="Далее" 
          onPress={handleNextStep} 
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  const renderSingleLegStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>
        mBESS: Пациент стоит на одной ноге ({testType === 'foam' ? 'на пенопласте' : 'на обычной поверхности'})
      </Text>
      <Text style={styles.stepDescription}>
        Тест {MBESS_TIMER_DURATION} секунд. Считайте количество ошибок баланса.
      </Text>
      
      <TimedClickerField
        label="Пациент стоит на одной ноге"
        errorCount={singleLegErrors}
        onErrorChange={setSingleLegErrors}
        maxErrors={MAX_ERRORS}
        timerDuration={MBESS_TIMER_DURATION}
        soundIntervalSeconds={SOUND_INTERVAL}
      />

      <View style={styles.buttonContainerSingle}>
        <SubmitButton 
          text="Далее" 
          onPress={handleNextStep} 
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  const renderResultsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.header}>
        Результаты mBESS ({testType === 'foam' ? 'на пенопласте' : 'на обычной поверхности'})
      </Text>
      
      <View style={styles.resultItem}>
        <Text style={styles.resultLabel}>Пациент стоит на двух ногах:</Text>
        <Text style={styles.resultValue}>{doubleLegErrors} ошибок</Text>
      </View>

      <View style={styles.resultItem}>
        <Text style={styles.resultLabel}>Тандемная позиция:</Text>
        <Text style={styles.resultValue}>{tandemErrors} ошибок</Text>
      </View>

      <View style={styles.resultItem}>
        <Text style={styles.resultLabel}>Пациент стоит на одной ноге:</Text>
        <Text style={styles.resultValue}>{singleLegErrors} ошибок</Text>
      </View>

      <View style={styles.totalDisplayContainer}>
        <Text style={styles.totalLabelText}>Общее количество отклонений:</Text>
        <View style={styles.totalValueRow}>
          <Text style={styles.totalValueText}>{totalErrors.toString()}</Text>
          <Text style={styles.scoreOutOfLabel}>из {MAX_ERRORS * 3}</Text>
        </View>
      </View>

      <View style={styles.notesBlock}>
        <Text style={styles.note}><Text style={{ fontWeight: 'bold' }}>Примечание:</Text> Если mBESS дает нормальные результаты, переходите к <Text style={{ fontWeight: 'bold' }}>тандемной походке/тандемной походке с двойным заданием</Text>.</Text>
        <Text style={styles.note}>Если mBESS выявляет аномальные результаты или клинически значимые трудности, в <Text style={{ fontWeight: 'bold' }}>тандемной походке</Text> на данный момент нет необходимости.</Text>
        <Text style={styles.note}>Как <Text style={{ fontWeight: 'bold' }}>тандемная походка</Text>, так и дополнительный компонент <Text style={{ fontWeight: 'bold' }}>двойной задачи</Text> могут быть применены позже по мере необходимости.</Text>
      </View>

      <View style={styles.resultsButtonContainer}>
        <SubmitButton 
          text="Сбросить тест" 
          onPress={handleResetAllMbessTests} 
          style={[styles.resultActionItem, styles.resetButton]}
        />
        <SubmitButton 
          text="Завершить тест" 
          onPress={handleFinalSubmit} 
          style={[styles.resultActionItem, styles.finishButton]}
        />
      </View>
    </View>
  );

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        {currentStep === STEP_INFO && renderInfoStep()}
        {currentStep === STEP_DOUBLE_LEG && renderDoubleLegStep()}
        {currentStep === STEP_TANDEM && renderTandemStep()}
        {currentStep === STEP_SINGLE_LEG && renderSingleLegStep()}
        {currentStep === STEP_RESULTS && renderResultsStep()}
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
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
    color: '#333',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    alignSelf: 'flex-start',
    lineHeight: 22,
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
  totalDisplayContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  totalLabelText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  totalValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    minHeight: 45,
  },
  totalValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  scoreOutOfLabel: {
    fontSize: 16,
    color: '#666',
    flexShrink: 0,
  },
  notesBlock: {
    width: '100%',
    marginBottom: 8,
    marginTop: 10,
  },
  note: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
  },
  buttonContainerSingle: {
    width: '100%',
    marginTop: 24,
  },
  resultsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    gap: 10,
  },
  actionButton: {
  },
  resultActionItem: {
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#E57373',
  },
  finishButton: {
  },
  resultItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    marginBottom: 8,
    borderRadius: 6,
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});