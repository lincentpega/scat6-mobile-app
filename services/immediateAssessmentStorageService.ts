import { ImmediateAssessment } from '@/model/ImmediateAssessment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveObservableSigns(observableSigns: ImmediateAssessment.ObservableSigns) {
  await AsyncStorage.setItem('observableSigns', JSON.stringify(observableSigns));
}

export async function loadObservableSigns(): Promise<ImmediateAssessment.ObservableSigns | null> {
  const data = await AsyncStorage.getItem('observableSigns');
  return data ? JSON.parse(data) as ImmediateAssessment.ObservableSigns : null;
}

export async function saveNeckSpineAssessment(neckSpineAssessment: ImmediateAssessment.NeckSpineAssessment) {
  await AsyncStorage.setItem('neckSpineAssessment', JSON.stringify(neckSpineAssessment));
}

export async function loadNeckSpineAssessment(): Promise<ImmediateAssessment.NeckSpineAssessment | null> {
  const data = await AsyncStorage.getItem('neckSpineAssessment');
  return data ? JSON.parse(data) as ImmediateAssessment.NeckSpineAssessment : null;
}

export async function saveGlasgowScale(glasgowScale: ImmediateAssessment.GlasgowScale) {
  await AsyncStorage.setItem('glasgowScale', JSON.stringify(glasgowScale));
}

export async function loadGlasgowScale(): Promise<ImmediateAssessment.GlasgowScale | null> {
  const data = await AsyncStorage.getItem('glasgowScale');
  return data ? JSON.parse(data) as ImmediateAssessment.GlasgowScale : null;
}

export async function saveCoordinationEyeMovement(coordinationEyeMovement: ImmediateAssessment.CoordinationEyeMovement) {
  await AsyncStorage.setItem('coordinationEyeMovement', JSON.stringify(coordinationEyeMovement));
}

export async function loadCoordinationEyeMovement(): Promise<ImmediateAssessment.CoordinationEyeMovement | null> {
  const data = await AsyncStorage.getItem('coordinationEyeMovement');
  return data ? JSON.parse(data) as ImmediateAssessment.CoordinationEyeMovement : null;
}

export async function saveMaddocksQuestions(maddocksQuestions: ImmediateAssessment.MaddocksQuestions) {
  await AsyncStorage.setItem('maddocksQuestions', JSON.stringify(maddocksQuestions));
}

export async function loadMaddocksQuestions(): Promise<ImmediateAssessment.MaddocksQuestions | null> {
  const data = await AsyncStorage.getItem('maddocksQuestions');
  return data ? JSON.parse(data) as ImmediateAssessment.MaddocksQuestions : null;
}

