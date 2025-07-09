import { MedicalOfficeAssessment } from "@/model";
import { MedicalOfficeAssessmentDto } from "@/model/dto/MedicalOfficeAssessmentDto";

export const mapToDto = (assessment: MedicalOfficeAssessment): MedicalOfficeAssessmentDto => {
    const symptomsScore = assessment.symptoms
        ? Object.values(assessment.symptoms).reduce((sum, val) => sum + val, 0)
        : 0;
    const orientationAssessmentScore = assessment.orientationAssessment
        ? Object.values(assessment.orientationAssessment).reduce((sum, val) => sum + val, 0)
        : 0;
    const shortTermMemory = {
        list: assessment.shortTermMemory?.list || '',
        score: 
            (assessment.shortTermMemory?.trial1Score ?? 0) +
            (assessment.shortTermMemory?.trial2Score ?? 0) +
            (assessment.shortTermMemory?.trial3Score ?? 0)
    }
    const concentrationNumbersScore = assessment.concentrationNumbers?.score ?? 0;
    const concentrationMonthsScore = assessment.concentrationMonths?.success ? 1 : 0;
    return {
        sportsmanId: assessment.sportsmanId,
        symptomsScore,
        symptomsDetails: {
            worseAfterPhysicalActivity: assessment.symptomsDetails?.worseAfterPhysicalActivity ?? false,
            worseAfterMentalActivity: assessment.symptomsDetails?.worseAfterMentalActivity ?? false,
            wellnessPercent: assessment.symptomsDetails?.wellnessPercent ?? 0,
            not100Reason: assessment.symptomsDetails?.not100Reason ?? undefined,
        },
        orientationAssessmentScore,
        shortTermMemory,
        concentrationNumbersScore,
        concentrationMonthsScore,
        mbessTest: {
            legTested: assessment.mbessTest?.legTested ?? '',
            surface: assessment.mbessTest?.surface ?? '',
            footwear: assessment.mbessTest?.footwear ?? '',
            type: assessment.mbessTest?.type ?? 'casual',
            standsOnBothFeet: assessment.mbessTest?.standsOnBothFeet ?? 0,
            tandemPosition: assessment.mbessTest?.tandemPosition ?? 0,
            standsOnOneFeet: assessment.mbessTest?.standsOnOneFeet ?? 0,
        },
        ...(assessment.tandemWalkIsolatedTask && {
            tandemWalkIsolatedTask: {
                trial1Time: assessment.tandemWalkIsolatedTask.trials[0] ?? 0,
                trial2Time: assessment.tandemWalkIsolatedTask.trials[1] ?? 0,
                trial3Time: assessment.tandemWalkIsolatedTask.trials[2] ?? 0,
            }
        }),
        ...(assessment.tandemWalkDualTask && {
            tandemWalkDualTask: {
                trial1Time: assessment.tandemWalkDualTask.trials[0]?.time ?? 0,
                trial1Errors: assessment.tandemWalkDualTask.trials[0]?.errors ?? 0,
                trial2Time: assessment.tandemWalkDualTask.trials[1]?.time ?? 0,
                trial2Errors: assessment.tandemWalkDualTask.trials[1]?.errors ?? 0,
                trial3Time: assessment.tandemWalkDualTask.trials[2]?.time ?? 0,
                trial3Errors: assessment.tandemWalkDualTask.trials[2]?.errors ?? 0,
            }
        }),
        ...(assessment.tandemWalkResult && {
            tandemWalkResult: {
                failedAnyTrial: assessment.tandemWalkResult.failedAnyTrial ?? false,
                failReason: assessment.tandemWalkResult.failReason,
            }
        }),
        deferedMemory: {
            list: assessment.deferredMemory?.list ?? '',
            result: assessment.deferredMemory?.result ?? 0,
        }
    }
}