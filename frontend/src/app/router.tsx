import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import BasicCalendar from './pages/BasicCalendar/BasicCalendar';
import Overview from './pages/Overview/Overview';
import EditEvent from "./pages/EditEvent/EditEvent";
import VolunteerManagement from "./pages/VolunteerManagement";
import Sidebar from "@components/layout/Sidebar"
import TopBar from "@components/layout/TopBar";
import ResetPassword from "@pages/ResetPassword/ResetPassword";
import CompleteSignup from "@pages/CompleteSignup/CompleteSignup";
import Account from "@pages/Account/Account";
import EventDetails from "@pages/EventDetails/EventDetails";

const Router: React.FC = () => {

  return (
    <Routes>
      <Route element={<TopBar />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="/complete-signup" element={<CompleteSignup />} />
      <Route element={<Sidebar />}>
        <Route path="/overview" element={<Overview />} />
        <Route path="/edit-event/:id" element={<EditEvent isSidebarOpen={false} />} />
        <Route path="/events/details/:id" element={<EventDetails />} />
        <Route path="/calendar" element={<BasicCalendar />} />
        <Route path="/volunteer-management" element={<VolunteerManagement />} /> */
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default Router;