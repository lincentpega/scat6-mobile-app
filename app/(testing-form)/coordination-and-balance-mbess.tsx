import React, { useState } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
// import TextInputField from '@/components/TextInputField'; // No longer needed for these fields
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import TimedClickerField from '@/components/TimedClickerField'; // Import the new component
import TextInputField from '@/components/TextInputField'; // Still needed for Total fields

export default function CoordinationAndBalanceMBESS() {
  const { medicalOfficeAssessment, updateMbessTestResults } = useFormContext();

  const MBESS_TIMER_DURATION = 20;
  const MAX_ERRORS = 10;
  const SOUND_INTERVAL = 20; // Play sound every 5 seconds

  // Main mBESS - initialize from context or default to 0 errors
  const [doubleLegErrors, setDoubleLegErrors] = useState(medicalOfficeAssessment.mbessTestResults?.casually.standsOnBothFeet || 0);
  const [tandemErrors, setTandemErrors] = useState(medicalOfficeAssessment.mbessTestResults?.casually.tandemPosition || 0);
  const [singleLegErrors, setSingleLegErrors] = useState(medicalOfficeAssessment.mbessTestResults?.casually.standsOnOneFeet || 0);
  // Foam (optional) - initialize from context or default to 0 errors
  const [foamDoubleLegErrors, setFoamDoubleLegErrors] = useState(medicalOfficeAssessment.mbessTestResults?.styrofoam?.standsOnBothFeet || 0);
  const [foamTandemErrors, setFoamTandemErrors] = useState(medicalOfficeAssessment.mbessTestResults?.styrofoam?.tandemPosition || 0);
  const [foamSingleLegErrors, setFoamSingleLegErrors] = useState(medicalOfficeAssessment.mbessTestResults?.styrofoam?.standsOnOneFeet || 0);

  // Calculate totals
  const totalErrors = doubleLegErrors + tandemErrors + singleLegErrors;
  const foamTotalErrors = foamDoubleLegErrors + foamTandemErrors + foamSingleLegErrors;

  const handleSubmit = () => {
    const casuallyScores: MedicalOfficeAssessment.MbessTestResults.Casually = {
      standsOnBothFeet: doubleLegErrors,
      tandemPosition: tandemErrors,
      standsOnOneFeet: singleLegErrors,
    };

    let styrofoamScores: MedicalOfficeAssessment.MbessTestResults.Styrofoam | undefined = undefined;
    // Only include styrofoam scores if at least one error count is greater than 0 or was explicitly set
    // This handles the case where fields might be empty strings initially if not touched.
    if (foamDoubleLegErrors > 0 || foamTandemErrors > 0 || foamSingleLegErrors > 0 || 
        medicalOfficeAssessment.mbessTestResults?.styrofoam?.standsOnBothFeet !== undefined ||
        medicalOfficeAssessment.mbessTestResults?.styrofoam?.tandemPosition !== undefined ||
        medicalOfficeAssessment.mbessTestResults?.styrofoam?.standsOnOneFeet !== undefined
    ) {
      styrofoamScores = {
        standsOnBothFeet: foamDoubleLegErrors,
        tandemPosition: foamTandemErrors,
        standsOnOneFeet: foamSingleLegErrors,
      };
    }

    const dataToSave: MedicalOfficeAssessment.MbessTestResults = {
      casually: casuallyScores,
    };

    if (styrofoamScores) {
      dataToSave.styrofoam = styrofoamScores;
    }

    updateMbessTestResults(dataToSave);
    router.push('/(testing-form)/tandem-walk');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.container}>
        <Text style={styles.header}>mBESS (по {MBESS_TIMER_DURATION} секунд каждый)</Text>
        
        <TimedClickerField
          label="Пациент стоит на двух ногах"
          errorCount={doubleLegErrors}
          onErrorChange={setDoubleLegErrors}
          maxErrors={MAX_ERRORS}
          timerDuration={MBESS_TIMER_DURATION}
          soundIntervalSeconds={SOUND_INTERVAL}
        />

        <TimedClickerField
          label="Тандемная позиция"
          errorCount={tandemErrors}
          onErrorChange={setTandemErrors}
          maxErrors={MAX_ERRORS}
          timerDuration={MBESS_TIMER_DURATION}
          soundIntervalSeconds={SOUND_INTERVAL}
        />

        <TimedClickerField
          label="Пациент стоит на одной ноге"
          errorCount={singleLegErrors}
          onErrorChange={setSingleLegErrors}
          maxErrors={MAX_ERRORS}
          timerDuration={MBESS_TIMER_DURATION}
          soundIntervalSeconds={SOUND_INTERVAL}
        />

        <View style={styles.totalDisplayContainer}>
          <Text style={styles.totalLabelText}>Общее количество отклонений:</Text>
          <View style={styles.totalValueRow}>
            <Text style={styles.totalValueText}>{totalErrors.toString()}</Text>
            <Text style={styles.scoreOutOfLabel}>из {MAX_ERRORS * 3}</Text>
          </View>
        </View>

        <View style={styles.optionalSection}>
          <Text style={styles.foamHeader}>На пенопласте (опционально)</Text>
          
          <TimedClickerField
            label="Пациент стоит на двух ногах"
            errorCount={foamDoubleLegErrors}
            onErrorChange={setFoamDoubleLegErrors}
            maxErrors={MAX_ERRORS}
            timerDuration={MBESS_TIMER_DURATION}
            soundIntervalSeconds={SOUND_INTERVAL}
          />

          <TimedClickerField
            label="Тандемная позиция"
            errorCount={foamTandemErrors}
            onErrorChange={setFoamTandemErrors}
            maxErrors={MAX_ERRORS}
            timerDuration={MBESS_TIMER_DURATION}
            soundIntervalSeconds={SOUND_INTERVAL}
          />

          <TimedClickerField
            label="Пациент стоит на одной ноге"
            errorCount={foamSingleLegErrors}
            onErrorChange={setFoamSingleLegErrors}
            maxErrors={MAX_ERRORS}
            timerDuration={MBESS_TIMER_DURATION}
            soundIntervalSeconds={SOUND_INTERVAL}
          />

          <View style={styles.totalDisplayContainer}>
            <Text style={styles.totalLabelText}>Общее количество отклонений:</Text>
            <View style={styles.totalValueRow}>
              <Text style={styles.totalValueText}>{foamTotalErrors.toString()}</Text>
              <Text style={styles.scoreOutOfLabel}>из {MAX_ERRORS * 3}</Text>
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
  totalDisplayContainer: {
    width: '100%',
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