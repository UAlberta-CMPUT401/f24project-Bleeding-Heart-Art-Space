import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Dashboard: React.FC = () => {
    return (
      <div className="dashboard">
      <nav>
        <ul>
          <li>
            <Link className="dashboard-button" to="/overview">Overview</Link>
          </li>
          <li>
            <Link className="dashboard-button" to="/calendar">Calendar</Link>
          </li>
          <li>
            <Link className="dashboard-button" to="/volunteer-management">Volunteer Management</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
