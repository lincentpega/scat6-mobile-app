export interface MedicalOfficeAssessment {
  id?: string;
  sportsmanId: string;
  athleteTmpFullName?: string;
  symptoms?: MedicalOfficeAssessment.Symptoms;
  orientationAssessment?: MedicalOfficeAssessment.OrientationAssessment;
  cognitiveFunctions?: MedicalOfficeAssessment.CognitiveFunctions;
  shortTermMemory?: MedicalOfficeAssessment.ShortTermMemory;
  concentrationNumbers?: MedicalOfficeAssessment.ConcentrationNumbers;
  concentrationMonths?: MedicalOfficeAssessment.ConcentrationMonths;
  mbessInfo?: MedicalOfficeAssessment.MbessInfo;
  mbessTestResults?: MedicalOfficeAssessment.MbessTestResults;
  tandemWalkIsolatedTask?: MedicalOfficeAssessment.TandemWalkIsolatedTask;
  tandemWalkDualTask?: MedicalOfficeAssessment.TandemWalkDualTask;
  tandemWalkResult?: MedicalOfficeAssessment.TandemWalkResult;
  deferredMemory?: MedicalOfficeAssessment.DeferredMemory;
  wasKnownBefore?: boolean;
  differsFromKnownBefore?: boolean;
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
    worseAfterPhysicalActivity: boolean;
    worseAfterMentalActivity: boolean;
    wellnessPercent: number;
    not100Reason: string;
  }

  export interface OrientationAssessment {
    month: boolean;
    date: boolean;
    weekday: boolean;
    year: boolean;
    time: boolean;
    score: number;
  }

  export interface CognitiveFunctions {
    month: number;
    date: number;
    weekday: number;
    year: number;
    time: number;
  }

  export interface ShortTermMemory {
    list: 'A' | 'B' | 'C';
    trials: Array<{
      trial: number; // 0, 1, or 2
      score: number;
    }>;
    testFinishTime: string; // ISO datetime string for when all trials were completed/submitted
  }

  export interface ConcentrationNumbers {
    numberList: string;
    score: number;
  }

  export interface ConcentrationMonths {
    errors: number;
    time: number; // seconds
    score: number;
  }

  export interface MbessInfo {
    legTested: 'right' | 'left' | '';
    surface: string;
    footwear: string;
  }

  export interface MbessTestResults {
    casually: MbessTestResults.Casually;
    styrofoam?: MbessTestResults.Styrofoam;
  }

  export namespace MbessTestResults {
    export interface Casually {
      standsOnBothFeet: number;
      tandemPosition: number;
      standsOnOneFeet: number;
    }
    export interface Styrofoam {
      standsOnBothFeet: number;
      tandemPosition: number;
      standsOnOneFeet: number;
    }
  }

  export interface TandemWalkIsolatedTask {
    trials: number[];
    avgResult: number;
    bestResult: number;
  }

  export interface TandemWalkDualTask {
    practice: {
      errors: number;
      time: number;
    };
    cognitive: {
      startNumber: number;
      trials: Array<{
        id: number;
        errors: number;
        time: number;
      }>;
    };
  }

  export interface TandemWalkResult {
    failedAnyTrial: boolean | null;
    failReason?: string;
  }

  export interface DeferredMemory {
    startTime: string;
    list: 'A' | 'B' | 'C';
    result: number;
  }
} 