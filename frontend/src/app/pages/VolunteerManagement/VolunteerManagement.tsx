import React, { useState} from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import VolunteerRoles from './VolunteerRoles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, index, value }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const VolunteerManagement: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    // const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null); // State for selected role ID

    // const handleDeleteRole = async () => {
    //     if (!user) return;
    //     if (selectedRoleId === null || !window.confirm('Are you sure you want to delete this role?')) {
    //         return;
    //     }

    //     deleteVolunteerRole(selectedRoleId, user).then(response => {
    //         if (isOk(response.status)) {
    //             alert('Volunteer role deleted successfully!');
    //             const updatedRoles = roles.filter(role => role.id !== selectedRoleId);
    //             setRoles(updatedRoles);
    //             setSelectedRoleId(null);
    //         } else {
    //             console.error('Error deleting volunteer role:', selectedRoleId);
    //             alert('Failed to delete volunteer role. Please try again.');
    //         }
    //     })
    // };

    const handleTabChange = (_event: React.SyntheticEvent, newTabValue: number) => {
        setTabValue(newTabValue);
    };

    return (
        <>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
            >
                <Tab label="Manage Users" />
                <Tab label="Volunteer Roles" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                Manage Users Tab
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <VolunteerRoles />
            </TabPanel>
        </>
    );
};

export default VolunteerManagement;
