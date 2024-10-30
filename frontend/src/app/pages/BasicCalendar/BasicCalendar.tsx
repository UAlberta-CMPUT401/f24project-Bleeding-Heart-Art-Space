import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventCalendar from './Components/CalendarEvent';
import CreateEventDialog from '../CreateEvent/CreateEventDialog';
import './BasicCalendar.css';
import { useEventStore } from '@stores/useEventStore';

const BasicCalendar: React.FC = () => {
    const { fetchEvents } = useEventStore(); //---> Fetch events function from EventStore!
    const [dialogOpen, setDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchEvents();
    }, []);

    // Function to handle slot selection
    const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
        // Set initial start and end dates
        setStartDate(slotInfo.start.toISOString().split('T')[0]);
        setEndDate(slotInfo.end.toISOString().split('T')[0]);
        setStartTime(slotInfo.start.toTimeString().split(' ')[0].slice(0, 5));
        setEndTime(slotInfo.end.toTimeString().split(' ')[0].slice(0, 5));
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);      
        navigate('/calendar');
    };

    // Clicking on an event navigates to EventDetails page!
    const handleEventClick = (eventId: string) => {
        navigate(`/events/details/${eventId}`);
    };

    const handleReqClick = () => {
        navigate('/create-event-request'); // Navigates to RequestEvent page
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <EventCalendar 
                onEventClick={handleEventClick} 
                onSlotSelect={handleSlotSelect} 
            />
            <Fab 
                color="primary" 
                aria-label="add" 
                className="floating-button"
                onClick={() => setDialogOpen(true)}
                style={{
                    position: 'fixed', 
                    bottom: 16, 
                    right: 16, 
                    zIndex: 1000 
                }}
            >
                <AddIcon />
            </Fab>
            <CreateEventDialog 
                open={dialogOpen} 
                onClose={handleDialogClose} 
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
            />
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
};

export default BasicCalendar;
