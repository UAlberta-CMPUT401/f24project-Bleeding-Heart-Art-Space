import TopNav from "@components/layout/TopNav"
import Dashboard from "@components/layout/Sidebar"
import EventCalendar from "./Components/CalendarEvent";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
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
    <>
        <div className="nav-container">
            {/* Top Navigation Bar */}
            <TopNav />

            <div className="dashboard-container">
                {/* Sidebar Dashboard */}
                <Dashboard />


            
                <div className="main-content">
                    <div className = "calendar-wrapper"> {/* Adjust height as needed */}
                        <EventCalendar onEventClick={handleEventClick} onSlotSelect={handleSlotSelect}/>

                        <div className="button-container">
                            <Link className="create-event-button" to="/create-event">Create Event</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}
