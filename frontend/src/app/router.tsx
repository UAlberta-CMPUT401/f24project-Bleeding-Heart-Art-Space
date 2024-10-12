import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BasicCalendar from './pages/components/BasicCalendar';
import HomePage from './pages/HomePage';
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import VolunteerManagement from "./pages/VolunteerManagement";


const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-event" element={<CreateEvent isSidebarOpen={false} onAddEvent={function (event: { title: string; start: Date; end: Date; venue: string; }): void {
        throw new Error("Function not implemented.");
      } } />} />
      <Route path="/edit-event/:id" element={<EditEvent isSidebarOpen={false} />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/calendar" element={<BasicCalendar />} />
      <Route path="/volunteer-management" element={<VolunteerManagement />} /> */
    </Routes>
  );
}

export default Router;
