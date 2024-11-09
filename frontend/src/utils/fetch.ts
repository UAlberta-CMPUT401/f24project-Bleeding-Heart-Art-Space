import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { User } from 'firebase/auth';
import { addAuthorizationHeader } from './authHelper';

// types.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  error: string | undefined;
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
      error: undefined,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: {} as T,
      status: axiosError.response?.status || 500,
      error: (axiosError.response?.data as any)?.error,
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
      error: undefined,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: {} as T,
      status: axiosError.response?.status || 500,
      error: (axiosError.response?.data as any)?.error,
    };
  }
}

// Generic PUT request
// If user is defined then the request will have authorization
export async function putData<T, D>(
  endpoint: string,
  payload: D,
  user?: User,
): Promise<ApiResponse<T>> {
  try {
    let config: AxiosRequestConfig = {};
    if (user) {
      config = await addAuthorizationHeader(user, config);
    }
    const response: AxiosResponse<T> = await axios.put(
      `${BASE_URL}${endpoint}`,
      payload,
      config
    );
    return {
      data: response.data,
      status: response.status,
      error: undefined,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: {} as T,
      status: axiosError.response?.status || 500,
      error: (axiosError.response?.data as any)?.error,
    };
  }
}

// Generic DELETE request
// If user is defined then the request will have authorization
export async function deleteData<T>(
  endpoint: string,
  user?: User,
): Promise<ApiResponse<T>> {
  try {
    let config: AxiosRequestConfig = {};
    if (user) {
      config = await addAuthorizationHeader(user, config);
    }
    const response: AxiosResponse<T> = await axios.delete(
      `${BASE_URL}${endpoint}`,
      config
    );
    return {
      data: response.data,
      status: response.status,
      error: undefined,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      data: {} as T,
      status: axiosError.response?.status || 500,
      error: (axiosError.response?.data as any)?.error,
    };
  }
}

export function isOk(status: number): boolean {
  return status >= 200 && status <= 299;
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
export async function putEvent(eventId: number, event: NewEvent, user: User): Promise<ApiResponse<void>> {
  return await putData<void, NewEvent>(`/events/${eventId}`, event, user);
}
export async function deleteEvent(eventId: number, user: User): Promise<ApiResponse<void>> {
  return await deleteData<void>(`/events/${eventId}`, user);
}

export type EventRequest = {
  id: number;
  start: Date;
  end: Date;
  venue: string;
  address: string;
  title: string;
  requester: number;
}
export type EventRequestData = {
  id: number;
  start: string;
  end: string;
  venue: string;
  address: string;
  title: string;
  requester: number;
}
export type EventRequestUser = {
  id: number;
  start: Date;
  end: Date;
  venue: string;
  address: string;
  title: string;
  requester: number;
  uid: string;
  first_name: string;
  last_name: string;
}
export type EventRequestUserData = {
  id: number;
  start: string;
  end: string;
  venue: string;
  address: string;
  title: string;
  requester: number;
  uid: string;
  first_name: string;
  last_name: string;
}
export type NewEventRequest = {
  start: string;
  end: string;
  venue: string;
  address: string;
  title: string;
}
export async function getEventRequest(eventRequestId: number, user: User): Promise<ApiResponse<EventRequest>> {
  const response = await getData<EventRequestData>(`/event_requests/${eventRequestId}`, user);
  return {
    ...response,
    data: {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
    }
  }
}
export async function getEventRequests(user: User): Promise<ApiResponse<EventRequestUser[]>> {
  const response = await getData<EventRequestUserData[]>('/event_requests', user);
  const formattedResponse: ApiResponse<EventRequestUser[]> = {
    ...response,
    data: response.data.map((eventData) => ({
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    })),
  }
  return formattedResponse;
}
export async function postEventRequest(newEventRequest: NewEventRequest, user: User): Promise<ApiResponse<EventRequest>> {
  const response = await postData<EventRequestData, NewEventRequest>('/event_requests', newEventRequest, user);
  return {
    ...response,
    data: {
      ...response.data,
      start: new Date(response.data.start),
      end: new Date(response.data.end),
    }
  }
}
export async function deleteEventRequest(eventRequestId: number, user: User): Promise<ApiResponse<void>> {
  return await deleteData<void>(`/event_requests/${eventRequestId}`, user);
}
export async function confirmEventRequest(eventRequestId: number, user: User): Promise<ApiResponse<Event>> {
  return await postData<Event, void>(`/event_requests/${eventRequestId}/confirm`, undefined, user);
}

export type VolunteerRole = {
  id: number;
  name: string;
};
export type NewVolunteerRole = {
  name: string;
};
export async function getVolunteerRoles(user: User): Promise<ApiResponse<VolunteerRole[]>> {
  return await getData<VolunteerRole[]>('/volunteer_roles', user);
}
export async function postVolunteerRole(newVolunteerRole: NewVolunteerRole, user: User): Promise<ApiResponse<VolunteerRole>> {
  return await postData<VolunteerRole, NewVolunteerRole>('/volunteer_roles', newVolunteerRole, user);
}
export async function deleteVolunteerRole(volunteerRoleId: number, user: User): Promise<ApiResponse<void>> {
  return await deleteData<void>(`/volunteer_roles/${volunteerRoleId}`, user);
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
  phone: string | null | undefined;
  role: number | null | undefined;
}
export type BackendUserAndRole = {
  uid: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: number | null;
  title: string | null;
  can_take_shift: boolean | null;
  can_request_event: boolean | null;
  is_admin: boolean | null;
  is_blocked: boolean | null;
}
export async function getBackendUser(user: User): Promise<ApiResponse<BackendUser>> {
  return await getData<BackendUser>(`/users/user`, user);
}
export async function getBackendUserAndRole(user: User): Promise<ApiResponse<BackendUserAndRole>> {
  return await getData<BackendUserAndRole>(`/users/user-role`, user);
}
export type NewBackendUser = {
  first_name: string;
  last_name: string;
  phone: string | null | undefined;
}
export async function postBackendUser(user: User, newBackendUser: NewBackendUser): Promise<ApiResponse<void>> {
  return await postData<void, NewBackendUser>('/users/user', newBackendUser, user);
}

export type ShiftSignupUser = {
  id: number;
  user_id: number;
  shift_id: number;
  checkin_time: Date | null | undefined;
  checkout_time: Date | null | undefined;
  notes: string | null | undefined;
  uid: string;
  first_name: string;
  last_name: string;
}
export type NewShiftSignup = {
  user_id: number;
  shift_id: number;
  checkin_time: string | null | undefined;
  checkout_time: string | null | undefined;
  notes: string | null | undefined;
}
export async function getEventShiftSignups(eventId: number, user: User): Promise<ApiResponse<ShiftSignupUser[]>> {
  const response = await getData<ShiftSignupUser[]>(`/shift-signups?eventId=${eventId}`, user);
  const formattedResponse: ApiResponse<ShiftSignupUser[]> = {
    ...response,
    data: response.data.map((shiftData) => ({
      ...shiftData,
      checkin_time: shiftData.checkin_time ? new Date(shiftData.checkin_time) : undefined,
      checkout_time: shiftData.checkout_time ? new Date(shiftData.checkout_time) : undefined,
    })),
  }
  return formattedResponse;
}
export async function postShiftSignup(shiftSignup: NewShiftSignup, user: User): Promise<ApiResponse<ShiftSignupUser>> {
  const response = await postData<ShiftSignupUser, NewShiftSignup>(`/shift-signups`, shiftSignup, user);
  const formattedResponse: ApiResponse<ShiftSignupUser> = {
    ...response,
    data: {
      ...response.data,
      checkin_time: response.data.checkin_time ? new Date(response.data.checkin_time) : undefined,
      checkout_time: response.data.checkout_time ? new Date(response.data.checkout_time) : undefined,
    },
  }
  return formattedResponse;
}
export type CheckIn = {
  checkin_time: string
}
export async function checkin(signupId: number, time: CheckIn, user: User): Promise<ApiResponse<void>> {
  return await postData<void, CheckIn>(`/shift-signups/${signupId}/checkin`, time, user);
}
export type CheckOut = {
  checkout_time: string
}
export async function checkout(signupId: number, time: CheckOut, user: User): Promise<ApiResponse<void>> {
  return await postData<void, CheckOut>(`/shift-signups/${signupId}/checkout`, time, user);
}
