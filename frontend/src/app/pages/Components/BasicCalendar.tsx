import moment from "moment";
import Calendar from "../Calendar";
import TopNav from "./TopNav"
import Dashboard from "../Dashboard"
import EventCalendar from "../CalendarEvent";


const events = [
    {
        start: moment("2024-10-09T10:00:00").toDate(),
        end: moment("2024-10-09T12:00:00").toDate(),
        title: "Meeting"
    },
];

export default function BasicCalendar() {
    return (
    <>
        <div className="nav-container">
            {/* Top Navigation Bar */}
            <TopNav />

            <div className="dashboard-container">
                {/* Sidebar Dashboard */}
                <Dashboard />
            
                <div className="main-content">
                    <div style={{ height: '500px' }}> {/* Adjust height as needed */}
                        <EventCalendar />
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}