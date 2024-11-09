import { create } from 'zustand';
import { getEvents, Event, postEvent, NewEvent, isOk } from '@utils/fetch';
import { User } from 'firebase/auth';

interface EventStore {
    events: Event[];
    fetchEvents: (user: User) => void;
    addEvent: (newEvent: NewEvent, user: User) => void;
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
    }
}));
