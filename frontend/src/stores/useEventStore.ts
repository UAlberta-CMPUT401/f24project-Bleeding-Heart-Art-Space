import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    venue: string;
    address: string;
}

interface EventData {
    title: string,
    venue: string,
    start: string,
    end: string,
    address: string,
};

interface EventStore {
    events: Event[];
    fetchEvents: () => void;
    addEvent: (eventData: EventData) => void;
}

export const useEventStore = create<EventStore>((set) => ({
    events: [],
    fetchEvents: async () => {
        try {
            const response = await axios.get(`${apiUrl}/events`);
            const fetchedEvents = response.data.map((event: any) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
                venue: event.venue,
                address: event.address
            }));
            set({ events: fetchedEvents });
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    },

    addEvent: async (eventData) => {
        try {
            const response = await axios.post(`${apiUrl}/events`, eventData);
            alert('Event created successfully!');

            const newEvent = {
                id: response.data.id,
                title: response.data.title,
                start: new Date(response.data.start),
                end: new Date(response.data.end),
                venue: response.data.venue,
                address: response.data.address,
            };
            set((prevEvents) => ({ events: [...prevEvents.events, newEvent]}));
        } catch (error: any) {
            console.error("Error creating event:", error.response?.data || error.message);
            alert('Failed to create event. Please try again.');
        }
    }
}));