import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { User } from 'firebase/auth';
import { addAuthorizationHeader } from './authHelper';

// types.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

// Generic GET request
// If user is defined then the request will have authorization
export async function getData<T>(
  endpoint: string,
  user?: User,
): Promise<ApiResponse<T>> {
  try {
    let config: AxiosRequestConfig = {};
    if (user) {
      config = await addAuthorizationHeader(user, config);
    }
    const response: AxiosResponse<T> = await axios.get(`${BASE_URL}${endpoint}`, config);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: {} as T,
      status: axiosError.response?.status || 500,
    };
  }
}

// Generic POST request
// If user is defined then the request will have authorization
export async function postData<T, D>(
  endpoint: string,
  payload: D,
  user?: User,
): Promise<ApiResponse<T>> {
  try {
    let config: AxiosRequestConfig = {};
    if (user) {
      config = await addAuthorizationHeader(user, config);
    }
    const response: AxiosResponse<T> = await axios.post(
      `${BASE_URL}${endpoint}`,
      payload,
      config
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
    };
  }
}

// Event details
export type Event = {
  id: number;                            // Auto-generated ID
  start: string                          // Event start date and time
  end: string                            // Event end date and time 
  venue: string;                         // Venue for the event
  address: string;                       // Address of the event
  title: string;                         // Title of the event
};

export async function getEvent(eventId: number, user: User): Promise<ApiResponse<Event>> {
  return await getData<Event>(`/events/${eventId}`, user);
}

export type VolunteerRole = {
  id: number;
  name: string;
};

export async function getVolunteerRoles(user: User): Promise<ApiResponse<VolunteerRole[]>> {
  return await getData<VolunteerRole[]>('/volunteer_roles', user);
}

export type Shift = {
  id: number;
  event_id: number;
  volunteer_role: number;
  start: string;
  end: string;
  max_volunteers: number;
  description?: string;
};

export async function getEventShifts(eventId: number, user: User): Promise<ApiResponse<Shift[]>> {
  return await getData<Shift[]>(`/events/${eventId}/volunteer_shifts`, user);
};

export type NewShift = {
  volunteer_role: number;
  start: string;
  end: string;
  max_volunteers: number;
  description?: string;
};
export async function postEventShifts(eventId: number, shifts: NewShift[], user: User): Promise<ApiResponse<Shift[]>> {
  return await postData<Shift[], NewShift[]>(`/events/${eventId}/volunteer_shifts`, shifts, user);
}

export type BackendUser = {
  first_name: string;
  last_name: string;
  email: string;
  id: number;
  uid: string;
  phone: string | null;
  role: number | null;
}
export async function getBackendUser(user: User): Promise<ApiResponse<BackendUser>> {
  return await getData<BackendUser>(`/users/user`, user);
}
export type NewBackendUser = {
  first_name: string;
  last_name: string;
  phone: string | null;
}
export async function postBackendUser(user: User, newBackendUser: NewBackendUser): Promise<ApiResponse<void>> {
  return await postData<void, NewBackendUser>('/users/user', newBackendUser, user);
}
