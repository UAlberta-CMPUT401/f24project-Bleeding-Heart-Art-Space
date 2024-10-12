import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import calendar styles

const localizer = momentLocalizer(moment); // Use moment for date localization

const apiUrl = "http://localhost:3000/api"; // API URL

interface Event {
  title: string;
  start: Date;
  end: Date;
  venue: string;
}

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events from the backend
  useEffect(() => {
    axios.get(`${apiUrl}/events`)
      .then(response => {
        const fetchedEvents = response.data.map((event: any) => ({
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          venue: event.venue
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
      />
    </div>
  );
};

export default EventCalendar;
