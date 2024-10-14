import React from 'react';
import TopNav from './components/TopNav'; // Import the TopNav component
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import './components/TopNav.css';
import './components/Dashboard.css';

const VolunteerManagement: React.FC = () => {
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

                    </div>
                </div>
            </div>
        </>
    );
};

export default VolunteerManagement;
