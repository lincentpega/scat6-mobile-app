import { ImmediateAssessment } from "@/model";
import { ImmediateAssessmentDto } from "@/model/dto/ImmediateAssessmentDto";

export const mapToDto = (assessment: ImmediateAssessment): ImmediateAssessmentDto => {
    const glasgowScaleScore = (assessment.glasgowScale?.eye ?? 0) +
        (assessment.glasgowScale?.verbal ?? 0) +
        (assessment.glasgowScale?.motor ?? 0);

    const maddocksQuestionsScore = assessment.maddocksQuestions
        ? Object.values(assessment.maddocksQuestions)
            .filter(v => v === true)
            .length
        : 0;

    return {
        sportsmanId: assessment.sportsmanId!,
        observableSigns: assessment.observableSigns,
        neckSpineAssessment: assessment.neckSpineAssessment,
        glasgowScaleScore,
        coordinationEyeMovement: assessment.coordinationEyeMovement,
        maddocksQuestionsScore,
    };
}; 