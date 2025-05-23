import { Gender, LeadingHand } from './enums';

export interface Sportsman {
  id?: number;
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
} 