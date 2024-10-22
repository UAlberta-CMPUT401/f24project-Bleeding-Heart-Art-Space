import EventCalendar from "./Components/CalendarEvent";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './BasicCalendar.css';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function BasicCalendar() {

    const navigate = useNavigate(); // Initialize useNavigate

    // Function to handle event clicks
    const handleEventClick = (eventId: string) => {
        navigate(`/edit-event/${eventId}`); // Navigates to EditEvent page
    };

    // Function to handle slot selection
    const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
        navigate(`/create-event?start=${slotInfo.start.toISOString()}&end=${slotInfo.end.toISOString()}`); // Navigates to CreateEvent page with start, end dates and times
    };

    // Function to handle FAB click
    const handleFabClick = () => {
        navigate('/create-event'); // Navigates to CreateEvent page without start and end dates
    };

    return (
        <div style={{ maxWidth: 900 }}>
            <EventCalendar onEventClick={handleEventClick} onSlotSelect={handleSlotSelect} />

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

        </div>
    );
}
