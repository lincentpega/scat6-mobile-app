import ScrollViewKeyboardAwareContainer from '@/components/Container';
import TextInputField from '@/components/TextInputField';
import React, { useState, useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LabeledPicker from '@/components/LabeledPicker';
import SubmitButton from '@/components/SubmitButton';
import { router } from "expo-router";
import { Sportsman } from '@/model/Sportsman';
import { Gender, LeadingHand } from '@/model/enums';
import { fetchAthlete, sendSportsman } from '@/services/apiService';
import { useAthleteContext } from '@/contexts/AthleteContext';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTimePicker from '@/components/CustomTimePicker';
import CheckboxField from '@/components/CheckboxField';
import { useFormContext } from '@/contexts/FormContext';

export default function AthleteInfo() {
  const { athleteId } = useAthleteContext();
  const { setIsFormActive } = useFormContext();
  
  const [athlete, setAthlete] = useState<Sportsman>({
    id: undefined,
    fullName: '',
    birthDate: '', // Stored as ISO string or empty string (as per interface)
    passport: undefined,
    gender: Gender.MALE,
    leadingHand: LeadingHand.RIGHT,
    otherInfo: undefined,
    sportType: '',
    yearOfStudy: undefined,
    completedYears: undefined,
    nativeLanguage: undefined,
    spokenLanguage: undefined,
    inspectionDate: undefined, // Stored as ISO string or undefined
    injuryDate: undefined, // Stored as ISO string or undefined
    injuryTime: undefined, // Stored as HH:mm string or undefined
    previousHeadInjuries: undefined,
    migraines: undefined,
    learningDisabilities: undefined,
    adhd: undefined,
    depressionAnxiety: undefined,
    currentMedications: undefined,
  });

  // Validate required fields
  const isFormValid = useMemo(() => {
    return athlete.fullName.trim() !== '' &&
           athlete.sportType.trim() !== '';
  }, [athlete.fullName, athlete.sportType]);

  useEffect(() => {
    // Set inspection date to current date automatically
    setAthlete(prev => ({
      ...prev,
      inspectionDate: new Date().toISOString()
    }));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        console.log("athleteId from context:", athleteId)

        if (athleteId) {
          // Load athlete data from server using API
          console.log("Loading athlete data from server with ID:", athleteId);
          const serverAthleteData = await fetchAthlete(athleteId);

          if (serverAthleteData) {
            console.log("Loaded athlete data from server (athlete-info.tsx):", JSON.stringify(serverAthleteData, null, 2));

            // Server data should already be in correct format, but ensure dates are ISO strings
            const processedAthlete: Sportsman = {
              ...serverAthleteData,
              id: athleteId,
              birthDate: serverAthleteData.birthDate || '',
            };

            setAthlete(processedAthlete);
            console.log("Processed athlete data from server (athlete-info.tsx):", JSON.stringify(processedAthlete, null, 2));
            return;
          }
        }

        // No fallback needed - user should select athlete from search
      } catch (error) {
        console.error("Error loading athlete data:", error);
        // No fallback - user should select athlete from search
      }
    })();
  }, [athleteId]);

  const handleSaveAthlete = async () => {
    try {
      console.log("Saving athlete data:", JSON.stringify(athlete, null, 2));
      const savedAthlete = await sendSportsman(athlete);
      console.log("Successfully saved athlete data:", JSON.stringify(savedAthlete, null, 2));
      
      // Update local state with server response
      setAthlete(savedAthlete);
      
      // Show success feedback (you can add a toast/alert here if needed)
      console.log("Athlete data saved successfully");
    } catch (e) {
      console.error("Failed to save athlete data", e);
      // Show error feedback (you can add a toast/alert here if needed)
    }
  }

  const handleBasicTesting = () => {
    router.replace("/(testing-form)/symptoms-questionary");
    setIsFormActive(true);
  }

  const handlePostInjuryTesting = () => {
    router.replace("/(testing-form)/observable-signs");
    setIsFormActive(true);
  }

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <TextInputField
            label="ФИО"
            placeholder="Введите ФИО"
            value={athlete.fullName}
            onChangeText={text => setAthlete(a => ({ ...a, fullName: text }))}
            required={true}
          />
        </View>


        {/* TODO: add auto set for inspection date */}

        <View style={styles.inputField}>
          <TextInputField
            label="Вид спорта"
            placeholder="Введите вид спорта"
            value={athlete.sportType}
            onChangeText={text => setAthlete(a => ({ ...a, sportType: text }))}
            required={true}
          />
        </View>

        {/* Hidden injury date and time fields - now optional
        <CustomDatePicker
          label="Дата получения травмы"
          value={athlete.injuryDate}
          onValueChange={isoDate => setAthlete(prev => ({ ...prev, injuryDate: isoDate }))}
          placeholder="Выберите дату травмы"
          required={false}
          limitToPastOrToday={true}
        />

        <CustomTimePicker
          label="Время получения травмы"
          value={athlete.injuryTime}
          onValueChange={timeString => setAthlete(prev => ({ ...prev, injuryTime: timeString }))}
          placeholder="Выберите время травмы"
          required={false}
        />
        */}

        <View style={styles.inputField}>
          <LabeledPicker label="Пол" selectedValue={athlete.gender} onValueChange={itemValue => setAthlete(a => ({ ...a, gender: itemValue as Gender }))}>
            <Picker.Item label="Мужской" value={Gender.MALE} color='black' />
            <Picker.Item label="Женский" value={Gender.FEMALE} color='black' />
          </LabeledPicker>
        </View>

        <CustomDatePicker
          label="Дата рождения"
          value={athlete.birthDate || ''} // Safely handle null/undefined
          onValueChange={isoDate => setAthlete(prev => ({ ...prev, birthDate: isoDate || '' }))} // Ensure empty string if undefined
          placeholder="Выберите дату рождения"
          required={false}
          limitToPastOrToday={true}
        />

        <View style={styles.inputField}>
          <TextInputField
            label="Серия и номер паспорта"
            placeholder="Введите серию и номер паспорта"
            value={athlete.passport ?? ''}
            onChangeText={text => setAthlete(a => ({ ...a, passport: text }))}
            keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Другое"
            placeholder="Введите другую информацию о спортсмене"
            value={athlete.otherInfo ?? ''}
            onChangeText={text => setAthlete(a => ({ ...a, otherInfo: text }))}
          />
        </View>
        <View style={styles.inputField}>
          <LabeledPicker label="Ведущая рука" selectedValue={athlete.leadingHand} onValueChange={itemValue => setAthlete(a => ({ ...a, leadingHand: itemValue as LeadingHand }))}>
            <Picker.Item label="Правая" value={LeadingHand.RIGHT} color='black' />
            <Picker.Item label="Левая" value={LeadingHand.LEFT} color='black' />
            <Picker.Item label="Амбидекстр" value={LeadingHand.AMBIDEXTROUS} color='black' />
          </LabeledPicker>
        </View>

        <View style={styles.inputField}>
          <TextInputField
            label="Год обучения в спортивной школе"
            placeholder="Введите год обучения"
            value={athlete.yearOfStudy !== undefined && athlete.yearOfStudy !== null ? athlete.yearOfStudy.toString() : ''}
            onChangeText={text => {
              const trimmedText = text.trim();
              const parsedValue = trimmedText && !isNaN(Number(trimmedText)) ? parseInt(trimmedText, 10) : undefined;
              setAthlete(a => ({ ...a, yearOfStudy: parsedValue }));
            }}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Завершенное количество лет обучения"
            placeholder="Количество завершенных лет обучения"
            value={athlete.completedYears !== undefined && athlete.completedYears !== null ? athlete.completedYears.toString() : ''}
            onChangeText={text => {
              const trimmedText = text.trim();
              const parsedValue = trimmedText && !isNaN(Number(trimmedText)) ? parseInt(trimmedText, 10) : undefined;
              setAthlete(a => ({ ...a, completedYears: parsedValue }));
            }}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Родной язык"
            placeholder="Введите родной язык"
            value={athlete.nativeLanguage ?? ''}
            onChangeText={text => setAthlete(a => ({ ...a, nativeLanguage: text }))}
          />
        </View>
        <View style={[styles.inputField, { marginBottom: 20 }]}>
          <TextInputField
            label="Разговорный язык"
            placeholder="Введите разговорный язык"
            value={athlete.spokenLanguage ?? ''}
            onChangeText={text => setAthlete(a => ({ ...a, spokenLanguage: text }))}
          />
        </View>

        <CheckboxField
          label="Были ли диагностированы предыдущие травмы головы?"
          checked={athlete.previousHeadInjuries?.wasDiagnosed ?? false}
          onChange={() => setAthlete(a => ({
            ...a,
            previousHeadInjuries: {
              wasDiagnosed: !(a.previousHeadInjuries?.wasDiagnosed ?? false),
              additionalInfo: a.previousHeadInjuries?.additionalInfo
            }
          }))}
          style={!athlete.previousHeadInjuries?.wasDiagnosed ? { borderBottomWidth: 0 } : {marginBottom: 10}}
        />

        {athlete.previousHeadInjuries?.wasDiagnosed && (
          <View style={styles.inputField}>
            <TextInputField
              label="Дополнительная информация о травмах головы"
              placeholder="Введите дополнительную информацию"
              value={athlete.previousHeadInjuries?.additionalInfo ?? ''}
              onChangeText={text => setAthlete(a => ({
                ...a,
                previousHeadInjuries: {
                  wasDiagnosed: a.previousHeadInjuries?.wasDiagnosed ?? false,
                  additionalInfo: text
                }
              }))}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        )}

        <CheckboxField
          label="Мигрени"
          checked={athlete.migraines ?? false}
          onChange={() => setAthlete(a => ({ ...a, migraines: !(a.migraines ?? false) }))}
          style={{ borderBottomWidth: 0 }}
        />

        <CheckboxField
          label="Нарушения обучаемости"
          checked={athlete.learningDisabilities ?? false}
          onChange={() => setAthlete(a => ({ ...a, learningDisabilities: !(a.learningDisabilities ?? false) }))}
          style={{ borderBottomWidth: 0 }}
        />

        <CheckboxField
          label="СДВГ (синдром дефицита внимания и гиперактивности)"
          checked={athlete.adhd ?? false}
          onChange={() => setAthlete(a => ({ ...a, adhd: !(a.adhd ?? false) }))}
          style={{ borderBottomWidth: 0 }}
        />

        <CheckboxField
          label="Депрессия/тревожность"
          checked={athlete.depressionAnxiety ?? false}
          onChange={() => setAthlete(a => ({ ...a, depressionAnxiety: !(a.depressionAnxiety ?? false) }))}
          style={{ marginBottom: 10 }}
        />

        <View style={[styles.inputField, { marginBottom: 20 }]}>
          <TextInputField
            label="Текущие медикаменты"
            placeholder="Введите принимаемые медикаменты"
            value={athlete.currentMedications ?? ''}
            onChangeText={text => setAthlete(a => ({ ...a, currentMedications: text }))}
            multiline={true}
            numberOfLines={2}
          />
        </View>

        <SubmitButton style={{ marginBottom: 20 }} onPress={handleSaveAthlete} text="Сохранить" disabled={!isFormValid} />
        
        <Text style={styles.testingLabel}>ТЕСТИРОВАНИЕ</Text>
        
        <SubmitButton 
          style={{ marginBottom: 10 }} 
          onPress={handleBasicTesting} 
          text="Базовое" 
        />
        
        <SubmitButton 
          style={{ marginBottom: 20 }} 
          onPress={handlePostInjuryTesting} 
          text="После травмы" 
        />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputField: {
    width: "100%",
    marginBottom: 20,
  },
  testingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
}); 