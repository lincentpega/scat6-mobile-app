// app/(home)/HomeScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import KeyboardAwareContainer from '@/components/Container';
import SubmitButton from '@/components/SubmitButton';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const { isUserLoggedIn, userFullName, signIn, logout } = useAuth();

  const handleSignInPress = async () => {
    setLoading(true);
    await signIn();
    setLoading(false);
  };

  const handleGoToForm = async () => {
    router.push('/(testing-form)/red-flags');
  }

  const handleLogoutPress = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    // при логауте контекст сбросит isUserLoggedIn, UI автоматически отрисуется
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
          <Text style={styles.nameText}>Добро пожаловать, {userFullName}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        {isUserLoggedIn ? (
          <> 
            <SubmitButton style={{ marginBottom: 10 }} onPress={handleGoToForm} text="Перейти к форме" />
            <SubmitButton onPress={handleLogoutPress} text="Выйти" />
          </>
        ) : (
          <SubmitButton onPress={handleSignInPress} text="Войти" />
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
