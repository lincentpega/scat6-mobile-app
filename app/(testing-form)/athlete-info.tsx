import ScrollViewKeyboardAwareContainer from '@/components/Container';
import TextInputField from '@/components/TextInputField';
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LabeledPicker from '@/components/LabeledPicker';
import SubmitButton from '@/components/SubmitButton';
import { router } from "expo-router";
import { Sportsman } from '@/model/Sportsman';
import { Gender, LeadingHand } from '@/model/enums';
import { saveAthlete, loadAthlete } from '@/services/athleteStorageService';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTimePicker from '@/components/CustomTimePicker';

// Helper to parse "DD.MM.YYYY" to a Date object
const parseRuDateString = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const dateObj = new Date(year, month, day);
      // Basic validation: check if the date parts were reasonable
      if (dateObj.getFullYear() === year && dateObj.getMonth() === month && dateObj.getDate() === day) {
        return dateObj;
      }
    }
  }
  return null;
};

// Helper to display formatted date or placeholder
const displayDate = (isoDateString: string | undefined, placeholder: string) => {
  if (isoDateString && typeof isoDateString === 'string') {
    const dateObj = new Date(isoDateString); // Expects ISO string
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('ru-RU'); // DD.MM.YYYY
    }
  }
  return placeholder;
};

export default function AthleteInfo() {
  const [athlete, setAthlete] = useState<Sportsman>({
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
  });

  useEffect(() => {
    (async () => {
      const loadedAthleteData = await loadAthlete();
      if (loadedAthleteData) {
        console.log("Loaded athlete data from storage (athlete-info.tsx):", JSON.stringify(loadedAthleteData, null, 2));
        
        const processedAthlete: Sportsman = { ...loadedAthleteData };

        // Convert DD.MM.YYYY from storage to ISO for consistent state
        const convertToIsoIfNeeded = (dateString: string | undefined) => {
            if (!dateString) return undefined;
            const parsedRu = parseRuDateString(dateString);
            if (parsedRu) return parsedRu.toISOString();
            // If not DD.MM.YYYY, assume it might already be ISO or other format new Date() handles
            if (!isNaN(new Date(dateString).getTime())) return new Date(dateString).toISOString();
            return dateString; // Return original if unparseable, CustomDatePicker will show placeholder
        };

        processedAthlete.birthDate = convertToIsoIfNeeded(loadedAthleteData.birthDate) || '';
        processedAthlete.inspectionDate = convertToIsoIfNeeded(loadedAthleteData.inspectionDate);
        processedAthlete.injuryDate = convertToIsoIfNeeded(loadedAthleteData.injuryDate);
        // injuryTime is already HH:mm, which CustomTimePicker expects
        
        setAthlete(processedAthlete);
        console.log("Processed athlete data for state (athlete-info.tsx):", JSON.stringify(processedAthlete, null, 2));

      }
    })();
  }, []);

  const handleNextStep = async () => {
    try {
      await saveAthlete(athlete); 
      console.log("Athlete info saved to storage (athlete-info.tsx):", JSON.stringify(athlete, null, 2));
      router.push("/(testing-form)/brain-injury-history");
    } catch (e) {
      console.error("Failed to save athlete info", e);
    }
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

        <CustomDatePicker
          label="Дата осмотра"
          value={athlete.inspectionDate}
          onValueChange={isoDate => setAthlete(prev => ({ ...prev, inspectionDate: isoDate }))}
          placeholder="Выберите дату осмотра"
          required={true}
          limitToPastOrToday={true}
        />

        <View style={styles.inputField}>
          <TextInputField
            label="Вид спорта"
            placeholder="Введите вид спорта"
            value={athlete.sportType}
            onChangeText={text => setAthlete(a => ({ ...a, sportType: text }))}
            required={true}
          />
        </View>

        <CustomDatePicker
          label="Дата получения травмы"
          value={athlete.injuryDate}
          onValueChange={isoDate => setAthlete(prev => ({ ...prev, injuryDate: isoDate }))}
          placeholder="Выберите дату травмы"
          required={true}
          limitToPastOrToday={true}
        />

        <CustomTimePicker
          label="Время получения травмы"
          value={athlete.injuryTime}
          onValueChange={timeString => setAthlete(prev => ({ ...prev, injuryTime: timeString }))}
          placeholder="Выберите время травмы"
          required={true}
        />

        <View style={styles.inputField}>
          <LabeledPicker label="Пол" selectedValue={athlete.gender} onValueChange={itemValue => setAthlete(a => ({ ...a, gender: itemValue as Gender }))}>
            <Picker.Item label="Мужской" value={Gender.MALE} color='black' />
            <Picker.Item label="Женский" value={Gender.FEMALE} color='black' />
          </LabeledPicker>
        </View>

        <CustomDatePicker
          label="Дата рождения"
          value={athlete.birthDate} // birthDate can be '' which CustomDatePicker should handle
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
            value={athlete.yearOfStudy !== undefined ? athlete.yearOfStudy.toString() : ''}
            onChangeText={text => setAthlete(a => ({ ...a, yearOfStudy: text ? parseInt(text) : undefined }))}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Завершенное количество лет обучения"
            placeholder="Количество завершенных лет обучения"
            value={athlete.completedYears !== undefined ? athlete.completedYears.toString() : ''}
            onChangeText={text => setAthlete(a => ({ ...a, completedYears: text ? parseInt(text) : undefined }))}
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
        <SubmitButton style={{ marginBottom: 20 }} onPress={handleNextStep} text="Следующий шаг" />
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
}); 