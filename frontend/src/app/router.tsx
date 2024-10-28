import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import BasicCalendar from './pages/BasicCalendar/BasicCalendar';
import Overview from './pages/Overview/Overview';
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import CreateEventRequest from "./pages/CreateEventRequests/CreateEventRequests";
import EditEvent from "./pages/EditEvent/EditEvent";
import { AuthProvider } from '../lib/context/AuthContext';
import VolunteerManagement from "./pages/VolunteerManagement/VolunteerManagement";
import Sidebar from "@components/layout/Sidebar"
import TopBar from "@components/layout/TopBar";
import ResetPassword from "@pages/ResetPassword/ResetPassword";
import CompleteSignup from "@pages/CompleteSignup/CompleteSignup";
import Account from "@pages/Account/Account";
import EventDetails from "@pages/EventDetails/EventDetails";
import VolunteerShifts from "@pages/VolunteerShifts/VolunteerShifts";
import EventRequests from "@pages/EventRequests/EventRequests";

interface Event {
  title: string;
  start: Date;
  end: Date;
  venue: string;
  address: string;
}

const Router: React.FC = () => {

  const [events, setEvents] = useState<Event[]>([]);
  const handleAddEvent = (eventData: { title: string; start: Date; end: Date; venue: string, address: string }) => {
    const newEvent: Event = {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      venue: eventData.venue,
      address: eventData.address
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    console.log("Event added:", newEvent);
  };

  return (
    <Routes>
      <Route element={<TopBar />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route element={<AuthProvider />}>
        <Route path="/complete-signup" element={<CompleteSignup />} />
        <Route element={<Sidebar />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/create-event" element={<CreateEvent isSidebarOpen={false} onAddEvent={handleAddEvent} />} />
          <Route path="/create-event-request" element={<CreateEventRequest isSidebarOpen={false} onAddEvent={handleAddEvent} />} />
          <Route path="/event-requests" element ={<EventRequests/>} />
          <Route path="/edit-event/:id" element={<EditEvent isSidebarOpen={false} />} />
          <Route path="/volunteer-shifts/:id" element={<VolunteerShifts />} />
          <Route path="/events/details/:id" element={<EventDetails />} />
          <Route path="/calendar" element={<BasicCalendar />} />
          <Route path="/volunteer-management" element={<VolunteerManagement />} /> */
          <Route path="/account" element={<Account />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
