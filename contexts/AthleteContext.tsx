import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface AthleteContextType {
  athleteId: string | null;
  athleteTmpFullName: string | null;
  setAthleteId: (id: string | null) => void;
  setAthleteTmpFullName: (name: string | null) => void;
  clearAthleteId: () => void;
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export const useAthleteContext = () => {
  const context = useContext(AthleteContext);
  if (!context) {
    throw new Error('useAthleteContext must be used within an AthleteProvider');
  }
  return context;
};

interface AthleteProviderProps {
  children: ReactNode;
}

export const AthleteProvider: React.FC<AthleteProviderProps> = ({ children }) => {
  const [athleteId, setAthleteId] = useState<string | null>(null);
  const [athleteTmpFullName, setAthleteTmpFullName] = useState<string | null>(null);

  const updateAthleteId = (id: string | null) => {
    setAthleteId(id);
  };

  const updateAthleteTmpFullName = (name: string | null) => {
    setAthleteTmpFullName(name);
  };

  const clearAthleteId = () => {
    setAthleteId(null);
  };

  const value = useMemo(() => ({
    athleteId,
    athleteTmpFullName,
    setAthleteId: updateAthleteId,
    setAthleteTmpFullName: updateAthleteTmpFullName,
    clearAthleteId
  }), [athleteId, athleteTmpFullName]);

  return (
    <AthleteContext.Provider value={value}>
      {children}
    </AthleteContext.Provider>
  );
}; 