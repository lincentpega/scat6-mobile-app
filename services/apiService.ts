import axios from 'axios';
import { getValidAccessToken } from './authService';
import { Sportsman, SportsmanSearchResult } from '@/model/Sportsman';
import { ImmediateAssessment } from '@/model/ImmediateAssessment';
import { MedicalOfficeAssessment } from '@/model';

// Base API URL - using the same IP as auth service
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.0.106:8080';

/**
 * Generic API request function with authentication using axios
 */
async function apiRequest<T>(endpoint: string, options: any = {}): Promise<T> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token available');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await axios({
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
    ...options,
  });

  return response.data;
}

/**
 * Send sportsman data to backend
 */
export async function sendSportsman(sportsman: Sportsman): Promise<Sportsman> {
  return apiRequest<Sportsman>('/api/sportsmans', {
    method: 'POST',
    data: sportsman,
  });
}

export async function sendMedicalOfficeAssessment(
  assessment: MedicalOfficeAssessment
): Promise<MedicalOfficeAssessment> {
  return apiRequest<MedicalOfficeAssessment>('/api/medical-office-assessments', {
    method: 'POST',
    data: assessment,
  });
}

export async function sendImmediateAssessment(
  assessment: ImmediateAssessment
): Promise<ImmediateAssessment> {
  return apiRequest<ImmediateAssessment>('/api/immediate-assessments', {
    method: 'POST',
    data: assessment,
  });
}

export async function fetchAthletes(page: number, limit: number, fullNamePrefix?: string): Promise<SportsmanSearchResult> {
  const params: any = {
    page,
    limit,
  };

  if (fullNamePrefix) {
    params.fullNamePrefix = fullNamePrefix;
  }

  return apiRequest<SportsmanSearchResult>('/api/sportsmans', {
    method: 'GET',
    params,
  });
}

export async function fetchAthlete(id: string): Promise<Sportsman> {
  return apiRequest<Sportsman>(`/api/sportsmans/${id}`, {
    method: 'GET',
  });
}