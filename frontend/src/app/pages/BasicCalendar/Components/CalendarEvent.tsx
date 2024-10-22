import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import calendar styles

const localizer = momentLocalizer(moment); // Use moment for date localization

const apiUrl = "http://localhost:3000/api"; // API URL

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  venue: string;
  address: string;
}

interface EventCalendarProps {
  events: { id: string; title: string; start: Date; end: Date }[];
  onEventClick: (eventId: string) => void;
  onSlotSelect: (slotInfo: SlotInfo) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ onEventClick, onSlotSelect  }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events from the backend
  useEffect(() => {
    axios.get(`${apiUrl}/events`)
      .then(response => {
        const fetchedEvents = response.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          venue: event.venue,
          address: event.address
        }));
        setEvents(fetchedEvents); // Set events to the state
      })
      .catch(error => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => onEventClick(event.id)}
        onSelectSlot={onSlotSelect}
        selectable
      />
    </div>
  );
};

export default EventCalendar;
