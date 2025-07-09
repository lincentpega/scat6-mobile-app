import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import KeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import TextInputField from '@/components/TextInputField';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useFormContext } from '@/contexts/FormContext';
import { useAthleteContext } from '@/contexts/AthleteContext';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const { isUserLoggedIn, userFullName, signIn, logout } = useAuth();
  const { setIsFormActive, isFormActive, resetForm } = useFormContext();
  const { setAthleteId, setAthleteTmpFullName, athleteTmpFullName } = useAthleteContext();

  const handleSignInPress = async () => {
    setLoading(true);
    await signIn();
    setLoading(false);
  };

  const handleLogoutPress = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  const handleBasicTesting = () => {
    setIsFormActive(true);
    router.replace('/(testing-form)/symptoms-questionary');
  };

  const handlePostInjuryTesting = () => {
    setIsFormActive(true);
    router.replace('/(testing-form)/observable-signs');
  };

  const handleResetForm = () => {
    resetForm();
    setAthleteId(null);
  };

  if (loading) {
    return (
      <KeyboardAwareContainer contentContainerStyle={styles.content}>
        <ActivityIndicator size="large" />
      </KeyboardAwareContainer>
    );
  }

  return (
    <KeyboardAwareContainer contentContainerStyle={styles.content}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SCAT6</Text>
        {isUserLoggedIn && userFullName && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text style={styles.nameText}>Добро пожаловать, {userFullName}</Text>
            <SubmitButton
              onPress={handleLogoutPress}
              text="Выйти"
              style={{
                marginTop: 10,
                paddingHorizontal: 30,
                paddingVertical: 15
              }}
            />
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        {!isUserLoggedIn && (
          <>
            <SubmitButton onPress={handleSignInPress} text="Войти" />
            
            <Text style={{ marginTop: 70, color: '#000', fontSize: 20, fontWeight: 'bold' }}>Оффлайн тестирование</Text>
            <View style={{ marginTop: 10, width: '100%' }}>
              <TextInputField
                placeholder="Введите имя спортсмена"
                value={athleteTmpFullName ?? ''}
                onChangeText={setAthleteTmpFullName}
                label="Имя спортсмена"
              />
            </View>
            <SubmitButton
              style={{ marginTop: 20 }}
              onPress={handleBasicTesting}
              text="Базовое тестирование"
              disabled={!athleteTmpFullName}
            />
            <SubmitButton
              style={{ marginTop: 10 }}
              onPress={handlePostInjuryTesting}
              text="Тестирование после травмы"
              disabled={!athleteTmpFullName}
            />
          </>
        )}

        {isFormActive && (
          <SubmitButton
            style={{ marginTop: 10, backgroundColor: '#ff4444' }}
            onPress={handleResetForm}
            text="Сбросить форму"
          />
        )}
      </View>
    </KeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 70,
  },
  headerText: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#000',
  },
  nameText: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});
