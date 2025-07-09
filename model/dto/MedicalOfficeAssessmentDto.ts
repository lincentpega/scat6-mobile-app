export interface MedicalOfficeAssessmentDto {
    sportsmanId: string;
    symptomsScore: number;
    symptomsDetails: {
        worseAfterPhysicalActivity: boolean;
        worseAfterMentalActivity: boolean;
        wellnessPercent: number;
        not100Reason?: string;
    };
    orientationAssessmentScore: number;
    shortTermMemory: {
        list: string;
        score: number;
    }
    concentrationNumbersScore: number;
    concentrationMonthsScore: number;
    mbessTest: {
        legTested: string;
        surface: string;
        footwear: string;
        type: 'casual' | 'styrofoam';
        standsOnBothFeet: number;
        tandemPosition: number;
        standsOnOneFeet: number;
    }
    tandemWalkIsolatedTask?: {
        trial1Time: number;
        trial2Time: number;
        trial3Time: number;
    }
    tandemWalkDualTask?: {
        trial1Time: number;
        trial1Errors: number;
        trial2Time: number;
        trial2Errors: number;
        trial3Time: number;
        trial3Errors: number;
    }
    tandemWalkResult?: {
        failedAnyTrial: boolean;
        failReason?: string;
    }
    deferedMemory: {
        list: string;
        result: number;
    }
}