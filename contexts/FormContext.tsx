import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImmediateAssessment } from '@/model/ImmediateAssessment';
import { MedicalOfficeAssessment } from '@/model/MedicalOfficeAssessment';

interface FormContextData {
  // ImmediateAssessment
  immediateAssessment: Partial<ImmediateAssessment>;
  updateObservableSigns: (data: ImmediateAssessment.ObservableSigns) => void;
  updateNeckSpineAssessment: (data: ImmediateAssessment.NeckSpineAssessment) => void;
  updateGlasgowScale: (data: ImmediateAssessment.GlasgowScale) => void;
  updateCoordinationEyeMovement: (data: ImmediateAssessment.CoordinationEyeMovement) => void;
  updateMaddocksQuestions: (data: ImmediateAssessment.MaddocksQuestions) => void;
  clearImmediateAssessment: () => void;

  // MedicalOfficeAssessment
  medicalOfficeAssessment: Partial<MedicalOfficeAssessment>;
  updateSymptoms: (data: MedicalOfficeAssessment.Symptoms) => void;
  updateOrientationAssessment: (data: MedicalOfficeAssessment.OrientationAssessment) => void;
  updateCognitiveFunctions: (data: MedicalOfficeAssessment.CognitiveFunctions) => void;
  updateShortTermMemory: (data: MedicalOfficeAssessment.ShortTermMemory) => void;
  updateConcentrationNumbers: (data: MedicalOfficeAssessment.ConcentrationNumbers) => void;
  updateConcentrationMonths: (data: MedicalOfficeAssessment.ConcentrationMonths) => void;
  updateMbessTest: (data: MedicalOfficeAssessment.MbessTest) => void;
  updateTandemWalkIsolatedTask: (data: MedicalOfficeAssessment.TandemWalkIsolatedTask) => void;
  updateTandemWalkDualTask: (data: MedicalOfficeAssessment.TandemWalkDualTask) => void;
  updateTandemWalkResult: (data: MedicalOfficeAssessment.TandemWalkResult) => void;
  updateDeferredMemory: (data: MedicalOfficeAssessment.DeferredMemory) => void;
  clearMedicalOfficeAssessment: () => void;

  // Form active state
  isFormActive: boolean;
  setIsFormActive: (value: boolean) => void;

  // Reset both forms and set isFormActive to false
  resetForm: () => void;
}

const FormContext = createContext<FormContextData | undefined>(undefined);

export function FormProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [immediateAssessment, setImmediateAssessment] = useState<Partial<ImmediateAssessment>>({});
  const [medicalOfficeAssessment, setMedicalOfficeAssessment] = useState<Partial<MedicalOfficeAssessment>>({});
  const [isFormActive, setIsFormActive] = useState<boolean>(false);

  // ImmediateAssessment update functions
  const updateObservableSigns = (data: ImmediateAssessment.ObservableSigns) => {
    setImmediateAssessment(prev => {
      const updated = { 
        ...prev, 
        observableSigns: data,
        // Set startDate automatically if not already set
        startDate: prev.startDate || new Date().toISOString()
      };
      console.log('updateObservableSigns, immediateAssessment:', updated);
      return updated;
    });
  };
  const updateNeckSpineAssessment = (data: ImmediateAssessment.NeckSpineAssessment) => {
    setImmediateAssessment(prev => {
      const updated = { ...prev, neckSpineAssessment: data };
      console.log('updateNeckSpineAssessment, immediateAssessment:', updated);
      return updated;
    });
  };
  const updateGlasgowScale = (data: ImmediateAssessment.GlasgowScale) => {
    setImmediateAssessment(prev => {
      const updated = { ...prev, glasgowScale: data };
      console.log('updateGlasgowScale, immediateAssessment:', updated);
      return updated;
    });
  };
  const updateCoordinationEyeMovement = (data: ImmediateAssessment.CoordinationEyeMovement) => {
    setImmediateAssessment(prev => {
      const updated = { ...prev, coordinationEyeMovement: data };
      console.log('updateCoordinationEyeMovement, immediateAssessment:', updated);
      return updated;
    });
  };
  const updateMaddocksQuestions = (data: ImmediateAssessment.MaddocksQuestions) => {
    setImmediateAssessment(prev => {
      const updated = { ...prev, maddocksQuestions: data };
      console.log('updateMaddocksQuestions, immediateAssessment:', updated);
      updated.endDate = prev.endDate || new Date().toISOString();
      return updated;
    });
  };
  const clearImmediateAssessment = () => setImmediateAssessment({});

  // MedicalOfficeAssessment update functions
  const updateSymptoms = (data: MedicalOfficeAssessment.Symptoms) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, symptoms: data };
      console.log('updateSymptoms, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateOrientationAssessment = (data: MedicalOfficeAssessment.OrientationAssessment) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, orientationAssessment: data };
      console.log('updateOrientationAssessment, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateCognitiveFunctions = (data: MedicalOfficeAssessment.CognitiveFunctions) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, cognitiveFunctions: data };
      console.log('updateCognitiveFunctions, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateShortTermMemory = (data: MedicalOfficeAssessment.ShortTermMemory) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, shortTermMemory: data };
      console.log(
        'updateShortTermMemory, medicalOfficeAssessment scores:',
        updated.shortTermMemory?.trial1Score,
        updated.shortTermMemory?.trial2Score,
        updated.shortTermMemory?.trial3Score
      );
      return updated;
    });
  };
  const updateConcentrationNumbers = (data: MedicalOfficeAssessment.ConcentrationNumbers) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, concentrationNumbers: data };
      console.log('updateConcentrationNumbers, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateConcentrationMonths = (data: MedicalOfficeAssessment.ConcentrationMonths) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, concentrationMonths: data };
      console.log('updateConcentrationMonths, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateMbessTest = (data: MedicalOfficeAssessment.MbessTest) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, mbessTest: data };
      console.log('updateMbessTest, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateTandemWalkIsolatedTask = (data: MedicalOfficeAssessment.TandemWalkIsolatedTask) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, tandemWalkIsolatedTask: data };
      console.log('updateTandemWalkIsolatedTask, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateTandemWalkDualTask = (data: MedicalOfficeAssessment.TandemWalkDualTask) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, tandemWalkDualTask: data };
      console.log('updateTandemWalkDualTask, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateTandemWalkResult = (data: MedicalOfficeAssessment.TandemWalkResult) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, tandemWalkResult: data };
      console.log('updateTandemWalkResult, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const updateDeferredMemory = (data: MedicalOfficeAssessment.DeferredMemory) => {
    setMedicalOfficeAssessment(prev => {
      const updated = { ...prev, deferredMemory: data };
      console.log('updateDeferredMemory, medicalOfficeAssessment:', updated);
      return updated;
    });
  };
  const clearMedicalOfficeAssessment = () => setMedicalOfficeAssessment({});

  // Reset both forms and set isFormActive to false
  const resetForm = () => {
    clearImmediateAssessment();
    clearMedicalOfficeAssessment();
    setIsFormActive(false);
  };

  const contextValue = React.useMemo(() => ({
    immediateAssessment,
    updateObservableSigns,
    updateNeckSpineAssessment,
    updateGlasgowScale,
    updateCoordinationEyeMovement,
    updateMaddocksQuestions,
    clearImmediateAssessment,
    medicalOfficeAssessment,
    updateSymptoms,
    updateOrientationAssessment,
    updateCognitiveFunctions,
    updateShortTermMemory,
    updateConcentrationNumbers,
    updateConcentrationMonths,
    updateMbessTest,
    updateTandemWalkIsolatedTask,
    updateTandemWalkDualTask,
    updateTandemWalkResult,
    updateDeferredMemory,
    clearMedicalOfficeAssessment,
    isFormActive,
    setIsFormActive,
    resetForm,
  }), [
    immediateAssessment,
    medicalOfficeAssessment,
    isFormActive
  ]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within a FormProvider');
  return context;
}
