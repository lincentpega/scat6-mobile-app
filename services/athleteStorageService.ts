import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sportsman } from '@/model/Sportsman';

const ATHLETE_KEY = 'athleteInfo';

export async function saveAthlete(athlete: Sportsman): Promise<void> {
  await AsyncStorage.setItem(ATHLETE_KEY, JSON.stringify(athlete));
}

export async function loadAthlete(): Promise<Sportsman | null> {
  const data = await AsyncStorage.getItem(ATHLETE_KEY);
  return data ? JSON.parse(data) as Sportsman : null;
} 