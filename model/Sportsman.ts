import { Gender, LeadingHand } from './enums';
import { PagedResult } from './common';

export interface PreviousHeadInjuries {
  wasDiagnosed: boolean;
  additionalInfo?: string;
}

export interface Sportsman {
  id?: string;
  fullName: string;
  birthDate: string; // ISO date string
  passport?: string;
  gender: Gender;
  leadingHand: LeadingHand;
  otherInfo?: string;
  sportType: string;
  yearOfStudy?: number;
  completedYears?: number;
  nativeLanguage?: string;
  spokenLanguage?: string;
  inspectionDate?: string; // ISO date string
  injuryDate?: string; // ISO date string
  injuryTime?: string; // ISO time string
  previousHeadInjuries?: PreviousHeadInjuries;
  migraines?: boolean;
  learningDisabilities?: boolean;
  adhd?: boolean;
  depressionAnxiety?: boolean;
  currentMedications?: string;
  numberOfBrainInjuries?: number;
  lastBrainInjuryDate?: string;
  brainInjurySymptoms?: string;
  daysOfRecovery?: number;
}

export interface SportsmanSearchItem {
  id: string;
  fullName: string;
  birthDate: string;
}

export type SportsmanSearchResult = PagedResult<SportsmanSearchItem>;