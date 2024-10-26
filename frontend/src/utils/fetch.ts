import axios, { AxiosResponse, AxiosError } from 'axios';

// types.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

// Generic GET request
export async function getData<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios.get(`${BASE_URL}${endpoint}`);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: {} as T,
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }
}

// Generic POST request
export async function postData<T, D>(
  endpoint: string,
  payload: D
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios.post(
      `${BASE_URL}${endpoint}`,
      payload
    );
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: {} as T,
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }
}

export type VolunteerRole = {
  id: number;
  name: string;
}
export async function getVolunteerRoles(): Promise<ApiResponse<VolunteerRole[]>> {
  return await getData<VolunteerRole[]>('/volunteer_roles');
}

export type Shift = {
  id: number;         // Primary key
  event_id: number;              // Foreign key referencing the event
  volunteer_role: number;        // Volunteer role for the shift (stored as an integer referencing volunteer_roles.id)
  start: string;  // Start time of the shift
  end: string;    // End time of the shift
  max_volunteers: number;
  description?: string;          // Optional description of the shift
}
export async function getEventShifts(eventId: number): Promise<ApiResponse<Shift[]>> {
  return await getData<Shift[]>(`/events/${eventId}/volunteer_shifts`);
}
export type NewShift = {
  volunteer_role: number;        // Volunteer role for the shift (stored as an integer referencing volunteer_roles.id)
  start: string;  // Start time of the shift
  end: string;    // End time of the shift
  max_volunteers: number;
  description?: string;          // Optional description of the shift
}
export async function postEventShifts(eventId: number, shifts: NewShift[]): Promise<ApiResponse<Shift[]>> {
  return await postData<Shift[], NewShift[]>(`/events/${eventId}/volunteer_shifts`, shifts);
}
