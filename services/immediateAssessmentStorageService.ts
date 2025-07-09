import { ImmediateAssessment } from "@/model/ImmediateAssessment";
import AsyncStorage from '@react-native-async-storage/async-storage';

const IMMEDIATE_ASSESSMENTS_KEY = 'immediate_assessments';

const loadAssessmentsArray = async (): Promise<Partial<ImmediateAssessment>[]> => {
    const existingRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
    if (!existingRaw) return [];
    try {
        const arr = JSON.parse(existingRaw);
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
};

export const saveImmediateAssessment = async (assessment: Partial<ImmediateAssessment>) => {
    console.log('Attempting to save immediate assessment:', assessment);
    try {
        let assessmentsArray = await loadAssessmentsArray();
        assessment.id ??= Date.now();
        assessmentsArray.push(assessment);
        await AsyncStorage.setItem(IMMEDIATE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        const updatedAssessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        if (updatedAssessmentsRaw) console.log('Current assessments in storage:', JSON.parse(updatedAssessmentsRaw));
    } catch (error) {
        console.error('Failed to save immediate assessment to AsyncStorage:', error);
    }
};

export const getImmediateAssessments = async (): Promise<Partial<ImmediateAssessment>[]> => {
    try {
        const assessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        
        if (!assessmentsRaw) {
            console.log('No immediate assessments found in storage');
            return [];
        }

        const assessments = JSON.parse(assessmentsRaw);
        
        if (!Array.isArray(assessments)) {
            console.warn('Stored assessments data is not an array, returning empty array');
            return [];
        }

        console.log('Retrieved', assessments.length, 'immediate assessments from storage');
        return assessments;
    } catch (error) {
        console.error('Failed to retrieve immediate assessments:', error);
        return [];
    }
};

export const updateImmediateAssessment = async (assessment: Partial<ImmediateAssessment>) => {
    console.log('Attempting to update immediate assessment:', assessment);
    try {
        let assessmentsArray = await loadAssessmentsArray();
        assessment.id ??= Date.now();
        const existingIndex = assessmentsArray.findIndex(item =>
            (item.id !== undefined && assessment.id !== undefined && item.id === assessment.id) ||
            (item.startDate && assessment.startDate && item.startDate === assessment.startDate)
        );
        if (existingIndex !== -1) {
            assessmentsArray[existingIndex] = assessment;
        } else {
            assessmentsArray.push(assessment);
        }
        await AsyncStorage.setItem(IMMEDIATE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        const updatedAssessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        if (updatedAssessmentsRaw) console.log('Current assessments in storage:', JSON.parse(updatedAssessmentsRaw));
    } catch (error) {
        console.error('Failed to update immediate assessment in AsyncStorage:', error);
    }
};

export const deleteImmediateAssessment = async (assessmentId: number) => {
    console.log('Attempting to delete immediate assessment with id:', assessmentId);
    try {
        let assessmentsArray = await loadAssessmentsArray();
        const initialLength = assessmentsArray.length;
        assessmentsArray = assessmentsArray.filter(item => item.id !== assessmentId);
        if (assessmentsArray.length === initialLength) return false;
        await AsyncStorage.setItem(IMMEDIATE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        return true;
    } catch (error) {
        console.error('Failed to delete immediate assessment from AsyncStorage:', error);
        return false;
    }
};

export const deleteAllImmediateAssessments = async () => {
    console.log('Attempting to delete all immediate assessments');
    try {
        await AsyncStorage.removeItem(IMMEDIATE_ASSESSMENTS_KEY);
        console.log('All immediate assessments deleted successfully');
        return true;
    } catch (error) {
        console.error('Failed to delete all immediate assessments from AsyncStorage:', error);
        return false;
    }
};