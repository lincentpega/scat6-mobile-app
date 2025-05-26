import React, { useState, useEffect } from 'react';
import ScrollViewKeyboardAwareContainer from '@/components/Container';
import InputLabel from '@/components/InputLabel';
import TextInputField from '@/components/TextInputField';
import SubmitButton from '@/components/SubmitButton';
import { View, Text, StyleSheet } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import type { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

export default function TandemWalkResult() {
  const { medicalOfficeAssessment, updateTandemWalkResult } = useFormContext();

  const [result, setResult] = useState<boolean | null>(
    medicalOfficeAssessment.tandemWalkResult?.failedAnyTrial ?? null
  );
  const [reason, setReason] = useState(
    medicalOfficeAssessment.tandemWalkResult?.failReason ?? ''
  );

  useEffect(() => {
    if (medicalOfficeAssessment.tandemWalkResult) {
      setResult(medicalOfficeAssessment.tandemWalkResult.failedAnyTrial ?? null);
      setReason(medicalOfficeAssessment.tandemWalkResult.failReason ?? '');
    }
  }, [medicalOfficeAssessment.tandemWalkResult]);

  const handleSubmit = () => {
    const dataToSave: MedicalOfficeAssessment.TandemWalkResult = {
      failedAnyTrial: result,
    };
    if (result === true && reason.trim() !== '') {
      dataToSave.failReason = reason.trim();
    }
    updateTandemWalkResult(dataToSave);
    router.push('/(testing-form)/deferred-memory');
  };

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: 'flex-start' }}>
      <View style={styles.inputContainer}>
        <InputLabel label="Были ли какие-либо однозадачные или двухзадачные испытания тандемной походки, рассчитанные по времени, не завершены из-за ошибок при ходьбе или по другим причинам?" required />
        <View style={styles.checkboxRow}>
          <View style={styles.checkboxItem}>
            <BouncyCheckbox
              isChecked={result === true}
              onPress={() => setResult(true)}
              fillColor="#000"
              unFillColor="#fff"
              size={28}
              iconStyle={{ borderColor: '#000', borderRadius: 6 }}
              innerIconStyle={{ borderWidth: 2, borderRadius: 6 }}
              style={{ marginRight: 8 }}
              disableText
            />
            <Text style={styles.checkboxLabel}>Да</Text>
          </View>
          <View style={styles.checkboxItem}>
            <BouncyCheckbox
              isChecked={result === false}
              onPress={() => setResult(false)}
              fillColor="#000"
              unFillColor="#fff"
              size={28}
              iconStyle={{ borderColor: '#000', borderRadius: 6 }}
              innerIconStyle={{ borderWidth: 2, borderRadius: 6 }}
              style={{ marginRight: 8 }}
              disableText
            />
            <Text style={styles.checkboxLabel}>Нет</Text>
          </View>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.subLabel}>Если да, почему?</Text>
          <TextInputField
            placeholder="Опишите причину..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            style={{ height: 80, marginTop: 4 }}
            editable={result === true}
          />
        </View>
        <SubmitButton
          text="Далее"
          onPress={handleSubmit}
          style={{ marginTop: 20, width: '100%' }}
        //   disabled={result === null || (result === true && reason.trim() === '')}
        />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
    gap: 24,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: 2,
  },
  inputField: {
    width: '100%',
    marginBottom: 20,
  },
  subLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#000',
  },
});