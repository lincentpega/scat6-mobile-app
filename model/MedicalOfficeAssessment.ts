import { Sportsman } from './Sportsman';

export interface MedicalOfficeAssessment {
  sportsmanInfo: MedicalOfficeAssessment.SportsmanInfo;
  symptoms: MedicalOfficeAssessment.Symptoms;
  cognitiveFunctions: MedicalOfficeAssessment.CognitiveFunctions;
  shortTermMemory: MedicalOfficeAssessment.ShortTermMemory[];
  concentrationNumbers: MedicalOfficeAssessment.ConcentrationNumbers[];
  concentrationMonths: MedicalOfficeAssessment.ConcentrationMonths;
  mbess: MedicalOfficeAssessment.Mbess;
  tandemWalk: MedicalOfficeAssessment.TandemWalk;
  deferredMemory: MedicalOfficeAssessment.DeferredMemory;
  wasKnownBefore: boolean;
  differsFromKnownBefore: boolean;
}

export namespace MedicalOfficeAssessment {
  export interface SportsmanInfo {
    previousHeadInjuries: PreviousHeadInjuries;
    migraines: boolean;
    learningDisabilities: boolean;
    adhd: boolean;
    depressionAnxiety: boolean;
    currentMedications?: string;
  }
  export interface PreviousHeadInjuries {
    wasDiagnosed: boolean;
    additionalInfo?: string;
  }

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
  }

  export interface CognitiveFunctions {
    month: number;
    date: number;
    weekday: number;
    year: number;
    time: number;
  }

  export interface ShortTermMemory {
    trial: number;
    score: number;
    testFinishTime: string; // ISO datetime string
  }

  export interface ConcentrationNumbers {
    numberList: number;
    score: number;
  }

  export interface ConcentrationMonths {
    errors: number;
    time: number; // seconds
  }

  export interface Mbess {
    legTested: number;
    surface: string;
    footwear: string;
    casually: Mbess.Casually;
    styrofoam: Mbess.Styrofoam;
  }
  export namespace Mbess {
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

  export interface TandemWalk {
    isolatedTask: TandemWalk.IsolatedTask;
    dual: TandemWalk.Dual;
    failedTrials: boolean;
    failReason?: string;
  }
  export namespace TandemWalk {
    export interface IsolatedTask {
      trials: number[];
      avgResult: number;
      bestResult: number;
    }
    export interface Dual {
      practice: Dual.Practice;
      cognitive: Dual.Cognitive;
    }
    export namespace Dual {
      export interface Practice {
        errors: number;
        time: number;
      }
      export interface Cognitive {
        trials: Cognitive.Trial[];
      }
      export namespace Cognitive {
        export interface Trial {
          id: number;
          errors: number;
          time: number;
        }
      }
    }
  }

  export interface DeferredMemory {
    startTime: string; // ISO datetime string
    list: string;
    result: number;
  }
} 