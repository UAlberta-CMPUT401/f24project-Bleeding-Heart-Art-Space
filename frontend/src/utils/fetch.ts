import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { User } from 'firebase/auth';
import { addAuthorizationHeader } from './authHelper';

// types.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
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

export function isOk(status: number): boolean {
  return status <= 200 && status <= 299;
}

// Event details
export type EventData = {
  id: number;                            // Auto-generated ID
  start: string;                          // Event start date and time
  end: string;                            // Event end date and time 
  venue: string;                         // Venue for the event
  address: string;                       // Address of the event
  title: string;                         // Title of the event
};
export type Event = {
  id: number;                            // Auto-generated ID
  start: Date;                          // Event start date and time
  end: Date;                            // Event end date and time 
  venue: string;                         // Venue for the event
  address: string;                       // Address of the event
  title: string;                         // Title of the event
};
export type NewEvent = {
  start: string;
  end: string;
  venue: string;
  address: string;
  title: string;
};
export async function getEvent(eventId: number, user: User): Promise<ApiResponse<Event>> {
  const response = await getData<EventData>(`/events/${eventId}`, user);
  return {
    ...response,
    data: {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
    }
  }
}
export async function getEvents(user: User): Promise<ApiResponse<Event[]>> {
  const response = await getData<EventData[]>('/events', user);
  const formattedResponse: ApiResponse<Event[]> = {
    ...response,
    data: response.data.map((eventData) => ({
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    })),
  }
  return formattedResponse;
}
export async function postEvent(newEvent: NewEvent, user: User): Promise<ApiResponse<Event>> {
  const response = await postData<EventData, NewEvent>('/events', newEvent, user);
  return {
    ...response,
    data: {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
    }
  }
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
