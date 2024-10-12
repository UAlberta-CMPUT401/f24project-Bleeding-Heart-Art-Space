import moment from "moment";
import Calendar from "../Calendar";
import TopNav from "./TopNav"



const events = [
    {
        start: moment("2024-10-09T10:00:00").toDate(),
        end: moment("2024-10-09T12:00:00").toDate(),
        title: "Meeting"
    },
];

export default function BasicCalendar() {
    return (
        <><div className="app-container">
            <TopNav />
        </div><div style={{ height: '500px' }}> {/* Adjust height as needed */}
                <Calendar events={events} />
            </div></>
    );
}