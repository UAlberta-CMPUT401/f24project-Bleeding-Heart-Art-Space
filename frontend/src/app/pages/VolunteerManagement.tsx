import React from 'react';
import TopNav from '@components/layout/TopNav'; // Import the TopNav component
import Dashboard from '@components/layout/Sidebar'; // Import the Dashboard component

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
