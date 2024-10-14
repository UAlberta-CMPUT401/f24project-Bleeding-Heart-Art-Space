import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BasicCalendar from './pages/BasicCalendar';
import Overview from './pages/Overview';
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import VolunteerManagement from "./pages/VolunteerManagement";
import Dashboard from "./pages/Dashboard";

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
      <Route path="/" element={<Home />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-event" element={<CreateEvent isSidebarOpen={false} onAddEvent={handleAddEvent} />} />
      <Route path="/edit-event/:id" element={<EditEvent isSidebarOpen={false} />} />
      <Route path="/calendar" element={<BasicCalendar />} />
      <Route path="/volunteer-management" element={<VolunteerManagement />} /> */
    </Routes>
  );
}

export default Router;
