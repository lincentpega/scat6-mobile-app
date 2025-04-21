import ScrollViewKeyboardAwareContainer from '@/components/Container';
import TextInputField from '@/components/TextInputField';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LabeledPicker from '@/components/LabeledPicker';
import SubmitButton from '@/components/SubmitButton';
import {router} from "expo-router";


export default function AthleteInfo() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [injuryDate, setInjuryDate] = useState("");
  const [injuryTime, setInjuryTime] = useState("");
  const [gender, setGender] = useState("male");
  const [otherInfo, setOtherInfo] = useState("");
  const [leadingHand, setLeadingHand] = useState("right");
  const [sportType, setSportType] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [completedYears, setCompletedYears] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [spokenLanguage, setSpokenLanguage] = useState("");

  const handleNextStep = () => {
    console.log("submit athlete info");
    router.push("/(testing-form)/brain-injury-history");
  }

  return (
    <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
      <View style={styles.inputContainer}>
        <View style={styles.inputField}>
          <TextInputField
            label="ФИО"
            placeholder="Введите ФИО"
            value={fullName}
            onChangeText={setFullName}
            required={true}
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Дата рождения"
            placeholder="Введите дату рождения"
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numbers-and-punctuation"
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Серия и номер паспорта"
            placeholder="Введите серию и номер паспорта"
            value={passportNumber}
            onChangeText={setPassportNumber}
            keyboardType="numbers-and-punctuation"
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Дата осмотра"
            placeholder="Введите дату осмотра"
            value={inspectionDate}
            onChangeText={setInspectionDate}
            keyboardType="numbers-and-punctuation"
            required={true}
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Дата получения травмы"
            placeholder="Введите дату получения травмы"
            value={injuryDate}
            onChangeText={setInjuryDate}
            keyboardType="numbers-and-punctuation"
            required={true}
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Время получения травмы"
            placeholder="Введите время получения травмы"
            value={injuryTime}
            onChangeText={setInjuryTime}
            keyboardType="numbers-and-punctuation"
            required={true}
          />
        </View>
        <View style={styles.inputField}>
          <LabeledPicker label="Пол" selectedValue={gender} onValueChange={(itemValue, _) => setGender(itemValue.toString())}>
            <Picker.Item label="Мужской" value="male" color='black' />
            <Picker.Item label="Женский" value="female" color='black' />
          </LabeledPicker>
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Другое"
            placeholder="Введите другую информацию о спортсмене"
            value={otherInfo}
            onChangeText={setOtherInfo}
          />
        </View>
        <View style={styles.inputField}>
          <LabeledPicker label="Ведущая рука" selectedValue={leadingHand} onValueChange={(itemValue, _) => setLeadingHand(itemValue.toString())}>
            <Picker.Item label="Правая" value="right" color='black' />
            <Picker.Item label="Левая" value="left" color='black' />
            <Picker.Item label="Амбидекстр" value="ambidextrous" color='black' />
          </LabeledPicker>
        </View>
        <View style={styles.inputField}>
          <TextInputField 
            label="Вид спорта"
            placeholder="Введите вид спорта"
            value={sportType}
            onChangeText={setSportType}
            required={true}
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Год обучения в спортивной школе"
            placeholder="Введите год обучения"
            value={yearOfStudy}
            onChangeText={setYearOfStudy}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Завершенное количество лет обучения"
            placeholder="Количество завершенных лет обучения"
            value={completedYears}
            onChangeText={setCompletedYears}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.inputField}>
          <TextInputField
            label="Родной язык"
            placeholder="Введите родной язык"
            value={nativeLanguage}
            onChangeText={setNativeLanguage}
          />
        </View>
        <View style={[styles.inputField, { marginBottom: 20 }]}>
          <TextInputField
            label="Разговорный язык"
            placeholder="Введите разговорный язык"
            value={spokenLanguage}
            onChangeText={setSpokenLanguage}
          />
        </View>
        <SubmitButton style={{ marginBottom: 20 }} onPress={handleNextStep} text="Следующий шаг" />
      </View>
    </ScrollViewKeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputField: {
    width: "100%",
    marginTop: 20,
  },
}); 