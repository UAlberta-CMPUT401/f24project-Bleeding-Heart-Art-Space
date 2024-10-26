import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '../lib/context/AuthContext'; // Hook to access auth state
import LoadingScreen from '../components/layout/LoadingScreen'; // Display while loading

// Import your authenticated pages
import Overview from './pages/Overview/Overview';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EditEvent from './pages/EditEvent/EditEvent';
import BasicCalendar from './pages/BasicCalendar/BasicCalendar';
import VolunteerManagement from './pages/VolunteerManagement';

// Define the Event type
interface Event {
  title: string;
  start: Date;
  end: Date;
  venue: string;
  address: string;
}

const AuthenticatedRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  
  // State to manage events
  const [events, setEvents] = useState<Event[]>([]);

  // Function to handle adding events
  const handleAddEvent = (eventData: { title: string; start: Date; end: Date; venue: string; address: string }) => {
    const newEvent: Event = {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      venue: eventData.venue,
      address: eventData.address,
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    console.log("Event added:", newEvent);
  };

  // If still determining the auth state, show a loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // If user is not authenticated, return null (or you can handle a redirect if needed)
  if (!user) {
    return null;
  }

  return (
    <Router>
      <Routes>
        {/* Authenticated routes */}
        <Route path="/overview" element={<Overview />} />
        <Route path="/create-event" element={<CreateEvent isSidebarOpen={false} onAddEvent={handleAddEvent} />} />
        <Route path="/edit-event/:id" element={<EditEvent isSidebarOpen={false} />} />
        <Route path="/calendar" element={<BasicCalendar />} />
        <Route path="/volunteer-management" element={<VolunteerManagement />} />
        {/* Add more authenticated routes here */}
      </Routes>
    </Router>
  );
};

export default AuthenticatedRoutes;
