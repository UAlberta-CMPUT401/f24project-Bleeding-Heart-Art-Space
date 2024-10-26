import { useState, useEffect } from 'react';
import EventCalendar from "./Components/CalendarEvent";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './BasicCalendar.css';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const apiUrl = import.meta.env.VITE_API_URL;

export default function BasicCalendar() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch events from API
    useEffect(() => {
        axios.get(`${apiUrl}/events`)
            .then(response => {
                const fetchedEvents = response.data.map((event: any) => ({
                    id: event.id, // Ensure each event has an id
                    title: event.title,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));
                setEvents(fetchedEvents);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, []);

    // Handle event click to navigate to EventDetails page
    const handleEventClick = (eventId: string) => {
        navigate(`/events/details/${eventId}`);
    };

    // Function to handle slot selection
    const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
        navigate(`/create-event?start=${slotInfo.start.toISOString()}&end=${slotInfo.end.toISOString()}`);
    };

    // Function to handle FAB click
    const handleFabClick = () => {
        navigate('/create-event'); // Navigates to CreateEvent page without start and end dates
    };

    const handleReqClick = () => {
        navigate('/create-event-request'); // Navigates to RequestEvent page
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Pass events, event click handler, and slot select handler to EventCalendar */}
            <EventCalendar 
                events={events} 
                onEventClick={handleEventClick} 
                onSlotSelect={handleSlotSelect} 
            />
            <Fab 
                color="primary" 
                aria-label="add" 
                className="floating-button"
                onClick={handleFabClick}
                style={{
                    position: 'fixed', 
                    bottom: 16, 
                    right: 16, 
                    zIndex: 1000 
                }}
            >
                <AddIcon />
            </Fab>
            <Fab 
                color="primary" 
                aria-label="add" 
                className="floating-button"
                onClick={handleReqClick}
                style={{
                    position: 'fixed', 
                    bottom: 16, 
                    right: 96, 
                    zIndex: 1000,
                    borderRadius: '8px',
                    padding: '10px 60px',
                    cursor: 'pointer',
                    display: 'flex',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                }}
            >
                Request Event
            </Fab>
        </div>
    );
}
