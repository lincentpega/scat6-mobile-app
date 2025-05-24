import { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveSymptoms(symptoms: MedicalOfficeAssessment.Symptoms) {
  await AsyncStorage.setItem('symptoms', JSON.stringify(symptoms));
}

export async function loadSymptoms(): Promise<MedicalOfficeAssessment.Symptoms | null> {
  const data = await AsyncStorage.getItem('symptoms');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.Symptoms : null;
}

export async function saveOrientationAssessment(orientationAssessment: MedicalOfficeAssessment.OrientationAssessment) {
  await AsyncStorage.setItem('orientationAssessment', JSON.stringify(orientationAssessment));
}

export async function loadOrientationAssessment(): Promise<MedicalOfficeAssessment.OrientationAssessment | null> {
  const data = await AsyncStorage.getItem('orientationAssessment');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.OrientationAssessment : null;
}

export async function saveCognitiveFunctions(cognitiveFunctions: MedicalOfficeAssessment.CognitiveFunctions) {
  await AsyncStorage.setItem('cognitiveFunctions', JSON.stringify(cognitiveFunctions));
}

export async function loadCognitiveFunctions(): Promise<MedicalOfficeAssessment.CognitiveFunctions | null> {
  const data = await AsyncStorage.getItem('cognitiveFunctions');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.CognitiveFunctions : null;
}

export async function saveShortTermMemory(shortTermMemory: MedicalOfficeAssessment.ShortTermMemory[]) {
  await AsyncStorage.setItem('shortTermMemory', JSON.stringify(shortTermMemory));
}

export async function loadShortTermMemory(): Promise<MedicalOfficeAssessment.ShortTermMemory[] | null> {
  const data = await AsyncStorage.getItem('shortTermMemory');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.ShortTermMemory[] : null;
}

export async function saveConcentrationNumbers(concentrationNumbers: MedicalOfficeAssessment.ConcentrationNumbers[]) {
  await AsyncStorage.setItem('concentrationNumbers', JSON.stringify(concentrationNumbers));
}

export async function loadConcentrationNumbers(): Promise<MedicalOfficeAssessment.ConcentrationNumbers[] | null> {
  const data = await AsyncStorage.getItem('concentrationNumbers');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.ConcentrationNumbers[] : null;
}

export async function saveConcentrationMonths(concentrationMonths: MedicalOfficeAssessment.ConcentrationMonths) {
  await AsyncStorage.setItem('concentrationMonths', JSON.stringify(concentrationMonths));
}

export async function loadConcentrationMonths(): Promise<MedicalOfficeAssessment.ConcentrationMonths | null> {
  const data = await AsyncStorage.getItem('concentrationMonths');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.ConcentrationMonths : null;
}

export async function saveMbess(mbess: MedicalOfficeAssessment.Mbess) {
  await AsyncStorage.setItem('mbess', JSON.stringify(mbess));
}

export async function loadMbess(): Promise<MedicalOfficeAssessment.Mbess | null> {
  const data = await AsyncStorage.getItem('mbess');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.Mbess : null;
}

export async function saveTandemWalk(tandemWalk: MedicalOfficeAssessment.TandemWalk) {
  await AsyncStorage.setItem('tandemWalk', JSON.stringify(tandemWalk));
}

export async function loadTandemWalk(): Promise<MedicalOfficeAssessment.TandemWalk | null> {
  const data = await AsyncStorage.getItem('tandemWalk');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.TandemWalk : null;
}

export async function saveDeferredMemory(deferredMemory: MedicalOfficeAssessment.DeferredMemory) {
  await AsyncStorage.setItem('deferredMemory', JSON.stringify(deferredMemory));
}

export async function loadDeferredMemory(): Promise<MedicalOfficeAssessment.DeferredMemory | null> {
  const data = await AsyncStorage.getItem('deferredMemory');
  return data ? JSON.parse(data) as MedicalOfficeAssessment.DeferredMemory : null;
} 