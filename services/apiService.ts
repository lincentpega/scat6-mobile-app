import { getValidAccessToken } from './authService';
import { Sportsman } from '@/model/Sportsman';
import { ImmediateAssessment } from '@/model/ImmediateAssessment';

// Base API URL - using the same IP as auth service
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://192.168.0.108:8788';

/**
 * Generic API request function with authentication
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token available');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Send sportsman data to backend
 */
export async function sendSportsman(sportsman: Sportsman): Promise<Sportsman> {
  return apiRequest<Sportsman>('/api/sportsmans', {
    method: 'POST',
    body: JSON.stringify(sportsman),
  });
}

/**
 * Send immediate assessment data to backend
 */
export async function sendImmediateAssessment(
  assessment: ImmediateAssessment
): Promise<ImmediateAssessment> {
  return apiRequest<ImmediateAssessment>('/api/immediate-assessments', {
    method: 'POST',
    body: JSON.stringify(assessment),
  });
}
