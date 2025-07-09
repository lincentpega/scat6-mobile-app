export interface ImmediateAssessmentDto {
    sportsmanId: string;
    observableSigns: {
        immobile: boolean;
        unprotectedFall: boolean;
        unsteadyGait: boolean;
        disorientation: boolean;
        vacantStare: boolean;
        facialInjury: boolean;
        seizure: boolean;
        highRiskMechanism: boolean;
    }
    neckSpineAssessment: {
        painAtRest: boolean;
        tenderness: boolean;
        fullActiveMovement: boolean;
        normalStrengthSensation: boolean;
    }
    glasgowScaleScore: number;
    coordinationEyeMovement: {
        coordination: boolean;
        eyeMovement: boolean;
        normalEyeMovement: boolean;
    }
    maddocksQuestionsScore: number;
}