import { MedicalOfficeAssessment } from "@/model/MedicalOfficeAssessment";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICAL_OFFICE_ASSESSMENTS_KEY = 'medical_office_assessments';

export const saveMedicalOfficeAssessment = async (assessment: Partial<MedicalOfficeAssessment>) => {
    console.log('Attempting to save medical office assessment:', assessment);
    try {
        const existingAssessmentsRaw = await AsyncStorage.getItem(MEDICAL_OFFICE_ASSESSMENTS_KEY);
        let assessmentsArray: Partial<MedicalOfficeAssessment>[] = [];

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
            assessment.id = Date.now().toString();
            console.log('Generated new ID for assessment:', assessment.id);
        }

        assessmentsArray.push(assessment);

        await AsyncStorage.setItem(MEDICAL_OFFICE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        console.log('Medical office assessment saved successfully. Total assessments:', assessmentsArray.length);
        
        // For debugging: Log the saved array
        const updatedAssessmentsRaw = await AsyncStorage.getItem(MEDICAL_OFFICE_ASSESSMENTS_KEY);
        if (updatedAssessmentsRaw) {
             console.log('Current assessments in storage:', JSON.parse(updatedAssessmentsRaw));
        }

    } catch (error) {
        console.error('Failed to save medical office assessment to AsyncStorage:', error);
    }
};

export const updateMedicalOfficeAssessment = async (assessment: Partial<MedicalOfficeAssessment>) => {
    console.log('Attempting to update medical office assessment:', assessment);
    try {
        const existingAssessmentsRaw = await AsyncStorage.getItem(MEDICAL_OFFICE_ASSESSMENTS_KEY);
        let assessmentsArray: Partial<MedicalOfficeAssessment>[] = [];

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
            assessment.id = Date.now().toString();
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
            if (item.symptoms && assessment.symptoms && 
                JSON.stringify(item.symptoms) === JSON.stringify(assessment.symptoms)) {
                return true;
            }
            
            return false;
        });
        
        if (existingIndex !== -1) {
            assessmentsArray[existingIndex] = assessment;
            console.log('Updated existing medical office assessment with id:', assessment.id);
        } else {
            assessmentsArray.push(assessment);
            console.log('Added new medical office assessment with id:', assessment.id);
        }

        await AsyncStorage.setItem(MEDICAL_OFFICE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        console.log('Medical office assessment saved successfully. Total assessments:', assessmentsArray.length);
        
        // For debugging: Log the saved array
        const updatedAssessmentsRaw = await AsyncStorage.getItem(MEDICAL_OFFICE_ASSESSMENTS_KEY);
        if (updatedAssessmentsRaw) {
             console.log('Current assessments in storage:', JSON.parse(updatedAssessmentsRaw));
        }

    } catch (error) {
        console.error('Failed to update medical office assessment in AsyncStorage:', error);
    }
};

export const getMedicalOfficeAssessments = async (): Promise<Partial<MedicalOfficeAssessment>[]> => {
    try {
        const assessmentsRaw = await AsyncStorage.getItem(MEDICAL_OFFICE_ASSESSMENTS_KEY);
        
        if (!assessmentsRaw) {
            console.log('No medical office assessments found in storage');
            return [];
        }

        const assessments = JSON.parse(assessmentsRaw);
        
        if (!Array.isArray(assessments)) {
            console.warn('Stored assessments data is not an array, returning empty array');
            return [];
        }

        console.log('Retrieved', assessments.length, 'medical office assessments from storage');
        return assessments;
    } catch (error) {
        console.error('Failed to retrieve medical office assessments:', error);
        return [];
    }
};

export const deleteMedicalOfficeAssessment = async (assessmentId: string) => {
    console.log('Attempting to delete medical office assessment with id:', assessmentId);
    try {
        const existingAssessmentsRaw = await AsyncStorage.getItem(MEDICAL_OFFICE_ASSESSMENTS_KEY);
        let assessmentsArray: Partial<MedicalOfficeAssessment>[] = [];

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

        await AsyncStorage.setItem(MEDICAL_OFFICE_ASSESSMENTS_KEY, JSON.stringify(assessmentsArray));
        console.log('Medical office assessment deleted successfully. Remaining assessments:', assessmentsArray.length);
        
        return true;
    } catch (error) {
        console.error('Failed to delete medical office assessment from AsyncStorage:', error);
        return false;
    }
};

export const deleteAllMedicalOfficeAssessments = async () => {
    console.log('Attempting to delete all medical office assessments');
    try {
        await AsyncStorage.removeItem(MEDICAL_OFFICE_ASSESSMENTS_KEY);
        console.log('All medical office assessments deleted successfully');
        return true;
    } catch (error) {
        console.error('Failed to delete all medical office assessments from AsyncStorage:', error);
        return false;
    }
};

