import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';  // <-- импортируем хук
import { AthleteProvider } from '@/contexts/AthleteContext';
import { useEffect } from 'react';

// Не даём сплэш-скрину закрыться до загрузки шрифтов
SplashScreen.preventAutoHideAsync();

const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home-outline" color={color} size={size} />
);

const FormTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="document-text-outline" color={color} size={size} />
);

const RedFlagsTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="warning-outline" color={color} size={size} />
);

// Новый внутренний компонент, который будет иметь доступ к AuthContext
function LayoutContent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { isUserLoggedIn } = useAuth();

  // прячем сплэш, как только шрифты подгрузились
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#0066cc',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Главная',
            tabBarLabel: 'Главная',
            headerShown: false,
            tabBarIcon: HomeTabIcon,
          }}
        />
        <Tabs.Screen
          name="red-flags"
          options={{
            title: 'Красные флаги',
            tabBarLabel: 'Красные флаги',
            headerShown: false,
            tabBarIcon: RedFlagsTabIcon,
          }}
        />
        <Tabs.Screen
          name="(athlete)"
          options={{
            title: 'Спортсмен',
            tabBarLabel: 'Спортсмен',
            headerShown: false,
            href: isUserLoggedIn ? undefined : null,
            tabBarIcon: FormTabIcon,
          }}
        />
        <Tabs.Screen
          name="(testing-form)"
          options={{
            title: 'Форма',
            tabBarLabel: 'Форма',
            headerShown: false,
            href: isUserLoggedIn ? undefined : null,
            tabBarIcon: FormTabIcon,
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AthleteProvider>
        <LayoutContent />
      </AthleteProvider>
    </AuthProvider>
  );
}