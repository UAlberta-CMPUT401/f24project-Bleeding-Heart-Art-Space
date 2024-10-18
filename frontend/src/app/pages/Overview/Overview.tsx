import React from "react";
import TopNav from "@components/layout/TopNav";
import Dashboard from "@components/layout/Dashboard";

const Overview: React.FC = () => {
  return (
    <>
      <div className="nav-container">
      {/* Top Navigation Bar */}
        <TopNav />

        <div className="dashboard-container">
          {/* Sidebar Dashboard */}
          <Dashboard />

          {/* Main Content */}
          <div className="main-content">
            <h1>Welcome back, Admin!</h1>

            <div>
              <h2>Upcoming Events</h2>
              <ul>
                <li>Event 1 - Date</li>
                <li>Event 2 - Date</li>
                <li>Event 3 - Date</li>
              </ul>
            </div>

            <div>
              <h2>Reminders</h2>
              <ul>
                <li>Reminder 1</li>
                <li>Reminder 2</li>
                <li>Reminder 3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
