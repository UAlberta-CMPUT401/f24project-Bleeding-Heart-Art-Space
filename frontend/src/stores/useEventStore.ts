import { create } from 'zustand';
import { getEvents, Event, postEvent, NewEvent, isOk, putEvent, deleteEvent } from '@utils/fetch';
import { User } from 'firebase/auth';

interface EventStore {
    events: Event[];
    fetchEvents: (user: User) => void;
    addEvent: (newEvent: NewEvent, user: User) => void;
    updateEvent: (eventId: number, updatedEventData: NewEvent, user: User) => void;
    deleteEvent: (eventId: number, user: User) => void;

}

export const useEventStore = create<EventStore>((set) => ({
    events: [],
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
            alert("End time must be after start time.");
            return;
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
            alert("Event updated successfully!");
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
