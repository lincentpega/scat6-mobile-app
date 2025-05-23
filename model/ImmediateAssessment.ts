export interface ImmediateAssessment {
  id?: number;
  startDate: string; // ISO datetime string
  endDate: string; // ISO datetime string
  sportsmanId: number;
  observableSigns: ImmediateAssessment.ObservableSigns;
  neckSpineAssessment: ImmediateAssessment.NeckSpineAssessment;
  glasgowScale: ImmediateAssessment.GlasgowScale;
  coordinationEyeMovement: ImmediateAssessment.CoordinationEyeMovement;
  maddocksQuestions: ImmediateAssessment.MaddocksQuestions;
}

export namespace ImmediateAssessment {
  export interface ObservableSigns {
    immobile: boolean;
    unprotectedFall: boolean;
    unsteadyGait: boolean;
    disorientation: boolean;
    vacantStare: boolean;
    facialInjury: boolean;
    seizure: boolean;
    highRiskMechanism: boolean;
  }

  export interface NeckSpineAssessment {
    painAtRest: boolean;
    tenderness: boolean;
    fullActiveMovement: boolean;
    normalStrengthSensation: boolean;
  }

  export interface GlasgowScale {
    eye: string;
    verbal: string;
    motor: string;
  }

  export interface CoordinationEyeMovement {
    coordination: boolean;
    eyeMovement: boolean;
    normalEyeMovement: boolean;
  }

  export interface MaddocksQuestions {
    event: boolean;
    period: boolean;
    lastScorer: boolean;
    teamLastWeek: boolean;
    teamWin: boolean;
  }
} 