import EventCalendar from "./Components/CalendarEvent";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './BasicCalendar.css';

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

    return (
        <div style={{ maxWidth: 900 }}>
            <EventCalendar onEventClick={handleEventClick} onSlotSelect={handleSlotSelect} />
        </div>
    );
}
