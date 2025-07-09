import { WordListKey } from '../constants/app-types';

export interface MedicalOfficeAssessment {
  id?: string;
  sportsmanId: string;
  athleteTmpFullName?: string;
  symptoms: MedicalOfficeAssessment.Symptoms;
  symptomsDetails: MedicalOfficeAssessment.SymptomsDetails;
  orientationAssessment: MedicalOfficeAssessment.OrientationAssessment;
  shortTermMemory: MedicalOfficeAssessment.ShortTermMemory;
  concentrationNumbers: MedicalOfficeAssessment.ConcentrationNumbers;
  concentrationMonths: MedicalOfficeAssessment.ConcentrationMonths;
  mbessTest: MedicalOfficeAssessment.MbessTest;
  tandemWalkIsolatedTask?: MedicalOfficeAssessment.TandemWalkIsolatedTask;
  tandemWalkDualTask?: MedicalOfficeAssessment.TandemWalkDualTask;
  tandemWalkResult?: MedicalOfficeAssessment.TandemWalkResult;
  deferredMemory: MedicalOfficeAssessment.DeferredMemory;
}

export namespace MedicalOfficeAssessment {
  export interface Symptoms {
    headache: number;
    headPressure: number;
    neckPain: number;
    nausea: number;
    dizziness: number;
    blurredVision: number;
    balance: number;
    lightSensitivity: number;
    noiseSensitivity: number;
    slowness: number;
    foggy: number;
    notRight: number;
    concentration: number;
    memory: number;
    fatigue: number;
    confusion: number;
    drowsiness: number;
    emotionality: number;
    irritability: number;
    depression: number;
    anxiety: number;
    sleepIssues: number;
  }

  export interface SymptomsDetails {
    worseAfterPhysicalActivity: boolean;
    worseAfterMentalActivity: boolean;
    wellnessPercent: number;
    not100Reason?: string;
  }

  export interface OrientationAssessment {
    month: boolean;
    date: boolean;
    weekday: boolean;
    year: boolean;
    time: boolean;
  }

  export interface ShortTermMemory {
    list: WordListKey;
    trial1Score: number;
    trial2Score: number;
    trial3Score: number;
    testFinishTime: Date;
  }

  export interface ConcentrationNumbers {
    numberList: string;
    score: number;
  }

  export interface ConcentrationMonths {
    success: boolean;
  }

  export interface CognitiveTrial {
    id: number;
    errors: number;
    time: number; // seconds
  }

  export interface MbessTest {
    legTested: 'right' | 'left' | '';
    surface: string;
    footwear: string;
    type: 'casual' | 'styrofoam';
    standsOnBothFeet: number;
    tandemPosition: number;
    standsOnOneFeet: number;
  }

  export interface TandemWalkIsolatedTask {
    trials: number[];
  }

  export interface TandemWalkDualTask {
    startNumber: number;
    trials: Array<CognitiveTrial>;
  }

  export interface TandemWalkResult {
    failedAnyTrial: boolean | null;
    failReason?: string;
  }

  export interface DeferredMemory {
    startTime: Date;
    list: WordListKey;
    result: number;
  }
} 