import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventCalendar from './Components/CalendarEvent';
import CreateEventDialog from '../CreateEvent/CreateEventDialog';
import './BasicCalendar.css';
import { useEventStore } from '@stores/useEventStore';
import { useAuth } from '@lib/context/AuthContext';
import { useBackendUserStore } from '@stores/useBackendUserStore';

const BasicCalendar: React.FC = () => {
    const { fetchEvents } = useEventStore(); //---> Fetch events function from EventStore!
    const [dialogOpen, setDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const { backendUser } = useBackendUserStore();
    
    useEffect(() => {
        if (user) {
            fetchEvents(user);
        }
    }, [user]);

    // Function to handle slot selection
    const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
        // can't create event if not admin and can't request event if not artist
        if (!backendUser) return;
        if (!backendUser.is_admin || !backendUser.can_request_event) return;

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

    return (
        <div style={{ width: '100%', height: '80vh', margin: "0 auto" }}>
            <EventCalendar 
                onEventClick={handleEventClick} 
                onSlotSelect={handleSlotSelect} 
            />
            {(backendUser?.is_admin || backendUser?.can_request_event) && <Fab 
                variant='extended'
                color="primary" 
                aria-label="add" 
                onClick={() => setDialogOpen(true)}
                style={{
                    position: 'absolute', 
                    bottom: 13, 
                    right: 13, 
                    zIndex: 1000, 
                    fontWeight: 'bold',
                }}
            >
                {backendUser?.is_admin ? <AddIcon /> : "Request Event"}
            </Fab>}
            <CreateEventDialog 
                open={dialogOpen} 
                onClose={handleDialogClose} 
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
            />
        </div>
    );
};

export default BasicCalendar;
