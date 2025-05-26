import { ImmediateAssessment } from "@/model/ImmediateAssessment";
import AsyncStorage from '@react-native-async-storage/async-storage';

const IMMEDIATE_ASSESSMENTS_KEY = 'immediate_assessments';

export const saveImmediateAssessment = async (assessment: Partial<ImmediateAssessment>) => {
    console.log('Attempting to save immediate assessment:', assessment);
    try {
        const existingAssessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        let assessmentsArray: Partial<ImmediateAssessment>[] = [];

        if (existingAssessmentsRaw) {
            try {
                assessmentsArray = JSON.parse(existingAssessmentsRaw);
                if (!Array.isArray(assessmentsArray)) {
                    console.warn('Existing data is not an array, initializing a new array.');
                    assessmentsArray = [];
                }
            } catch (e) {
                console.error('Failed to parse existing assessments, initializing a new array:', e);
                assessmentsArray = [];
            }
        }

        // Generate a unique ID if assessment doesn't have one
        if (!assessment.id) {
            assessment.id = Date.now();
            console.log('Generated new ID for assessment:', assessment.id);
        }

        assessmentsArray.push(assessment);

        await AsyncStorage.setItem(IMMEDIATE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        console.log('Immediate assessment saved successfully. Total assessments:', assessmentsArray.length);
        
        // For debugging: Log the saved array
        const updatedAssessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        if (updatedAssessmentsRaw) {
             console.log('Current assessments in storage:', JSON.parse(updatedAssessmentsRaw));
        }

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
        const existingAssessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        let assessmentsArray: Partial<ImmediateAssessment>[] = [];

        if (existingAssessmentsRaw) {
            try {
                assessmentsArray = JSON.parse(existingAssessmentsRaw);
                if (!Array.isArray(assessmentsArray)) {
                    console.warn('Existing data is not an array, initializing a new array.');
                    assessmentsArray = [];
                }
            } catch (e) {
                console.error('Failed to parse existing assessments, initializing a new array:', e);
                assessmentsArray = [];
            }
        }

        // Generate a unique ID if assessment doesn't have one
        if (!assessment.id) {
            assessment.id = Date.now();
            console.log('Generated new ID for assessment:', assessment.id);
        }

        // Find and update existing assessment by comparing all available identifiers
        const existingIndex = assessmentsArray.findIndex(item => {
            // First try to match by ID if both have IDs
            if (item.id !== undefined && assessment.id !== undefined) {
                return item.id === assessment.id;
            }
            
            // If no ID match possible, try to match by content similarity
            // This is a fallback for cases where IDs might not be set
            if (item.startDate && assessment.startDate && item.startDate === assessment.startDate) {
                return true;
            }
            
            return false;
        });
        
        if (existingIndex !== -1) {
            assessmentsArray[existingIndex] = assessment;
            console.log('Updated existing immediate assessment with id:', assessment.id);
        } else {
            assessmentsArray.push(assessment);
            console.log('Added new immediate assessment with id:', assessment.id);
        }

        await AsyncStorage.setItem(IMMEDIATE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        console.log('Immediate assessment saved successfully. Total assessments:', assessmentsArray.length);
        
        // For debugging: Log the saved array
        const updatedAssessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        if (updatedAssessmentsRaw) {
             console.log('Current assessments in storage:', JSON.parse(updatedAssessmentsRaw));
        }

    } catch (error) {
        console.error('Failed to update immediate assessment in AsyncStorage:', error);
    }
};

export const deleteImmediateAssessment = async (assessmentId: number) => {
    console.log('Attempting to delete immediate assessment with id:', assessmentId);
    try {
        const existingAssessmentsRaw = await AsyncStorage.getItem(IMMEDIATE_ASSESSMENTS_KEY);
        let assessmentsArray: Partial<ImmediateAssessment>[] = [];

        if (existingAssessmentsRaw) {
            try {
                assessmentsArray = JSON.parse(existingAssessmentsRaw);
                if (!Array.isArray(assessmentsArray)) {
                    console.warn('Existing data is not an array, cannot delete.');
                    return false;
                }
            } catch (e) {
                console.error('Failed to parse existing assessments:', e);
                return false;
            }
        }

        // Filter out the assessment to delete
        const initialLength = assessmentsArray.length;
        assessmentsArray = assessmentsArray.filter(item => item.id !== assessmentId);
        
        if (assessmentsArray.length === initialLength) {
            console.log('Assessment with id', assessmentId, 'not found');
            return false;
        }

        await AsyncStorage.setItem(IMMEDIATE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        console.log('Immediate assessment deleted successfully. Remaining assessments:', assessmentsArray.length);
        
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