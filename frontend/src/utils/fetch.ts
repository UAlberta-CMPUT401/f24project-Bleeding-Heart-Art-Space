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

// Event details
export type EventDetails = {
  start: string;
  end: string;
};

export async function getEventDetails(eventId: number): Promise<ApiResponse<EventDetails>> {
  const response = await getData<EventDetails>(`/events/${eventId}`);
  if (!response.data.start) {
    console.error(`Failed to fetch eventstart for eventId ${eventId}`);
  }
  return response;
}

export type VolunteerRole = {
  id: number;
  name: string;
};

export async function getVolunteerRoles(): Promise<ApiResponse<VolunteerRole[]>> {
  return await getData<VolunteerRole[]>('/volunteer_roles');
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

export async function getEventShifts(eventId: number): Promise<ApiResponse<Shift[]>> {
  return await getData<Shift[]>(`/events/${eventId}/volunteer_shifts`);
};

export type NewShift = {
  volunteer_role: number;
  start: string;
  end: string;
  max_volunteers: number;
  description?: string;
};

export async function postEventShifts(eventId: number, shifts: NewShift[]): Promise<ApiResponse<Shift[]>> {
  // Fetch event details to get the event date
  const eventDetails = await getEventDetails(eventId);

  if (!eventDetails.data.start) {
    throw new Error("Event start date is missing");
  }

  const eventDate = eventDetails.data.start.split('T')[0]; // Use event start date as YYYY-MM-DD

  // Format shifts with event date and shift times
  const formattedShifts = shifts.map((shift) => ({
    ...shift,
    start: `${eventDate}T${shift.start}`, // Combine event date with shift start time
    end: `${eventDate}T${shift.end}`,     // Combine event date with shift end time
  }));

  return await postData<Shift[], NewShift[]>(`/events/${eventId}/volunteer_shifts`, formattedShifts);
}
