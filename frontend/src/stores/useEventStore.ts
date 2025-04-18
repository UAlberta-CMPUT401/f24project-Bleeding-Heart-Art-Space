import { create } from 'zustand';
import { getEvents, Event, postEvent, NewEvent, isOk, putEvent, deleteEvent, getEvent } from '@utils/fetch';
import { User } from 'firebase/auth';

interface EventStore {
    events: Event[];
    fetchEvent: (eventId: number, user: User) => void;
    fetchEvents: (user: User) => void;
    addEvent: (newEvent: NewEvent, user: User) => void;
    updateEvent: (eventId: number, updatedEventData: NewEvent, user: User) => void;
    deleteEvent: (eventId: number, user: User) => void;

}

export const useEventStore = create<EventStore>((set) => ({
    events: [],
    fetchEvent: async (eventId: number, user: User) => {
        const response = await getEvent(eventId, user)
        if (isOk(response.status)) {
            set(prev => ({ events: [...prev.events.filter(event => event.id !== eventId), response.data] }))
        }
    },
    fetchEvents: async (user: User) => {
        const response = await getEvents(user);
        if (isOk(response.status)) {
            set({ events: response.data });
        }
    },
    addEvent: async (newEvent: NewEvent, user: User) => {
        const response = await postEvent(newEvent, user);
        if (isOk(response.status)) {
            set(prev => ({ events: [...prev.events, response.data] }));
        }
    },
    updateEvent: async (eventId: number, updatedEventData: NewEvent, user: User) => {
        const startDateTime = new Date(updatedEventData.start);
        const endDateTime = new Date(updatedEventData.end);
    
        if (startDateTime >= endDateTime) {
            console.error("Start time cannot be after end time.");
            return Promise.reject("Invalid time range");
        }
    
        const eventToUpdate: NewEvent = {
            ...updatedEventData,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
        };
    
        const response = await putEvent(eventId, eventToUpdate, user);
        if (isOk(response.status)) {
            const updatedEventWithDateObjects = {
                ...updatedEventData,
                start: startDateTime,
                end: endDateTime,
            };
    
            set(prev => ({
                events: prev.events.map(event =>
                    event.id === eventId ? { ...event, ...updatedEventWithDateObjects } : event
                )
            }));
        } else {
            console.error("Failed to update event:", response);
            alert('Failed to update event. Please try again.');
        }
    },    
    deleteEvent: async (eventId: number, user: User) => {
        const response = await deleteEvent(eventId, user);
        if (isOk(response.status)) {
            set(prev => ({ events: prev.events.filter(event => event.id !== eventId) }));
        } else {
            console.error("Failed to delete event:", response);
        }
    }
}));
