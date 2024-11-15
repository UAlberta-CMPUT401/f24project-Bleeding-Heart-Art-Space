import React, { useEffect, useState} from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import VolunteerRoles from './VolunteerRoles';
import { useAuth } from '@lib/context/AuthContext';
import { useVolunteerRoleStore } from '@stores/useVolunteerRoleStore';
import { useManageUserStore } from '@stores/useManageUserStore';
import ManageUsers from './ManageUsers';

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
    const { user } = useAuth();
    const { fetchVolunteerRoles } = useVolunteerRoleStore();
    const { fetchInit } = useManageUserStore();

    useEffect(() => {
        if (user) {
            fetchVolunteerRoles(user);
            fetchInit(user);
        }
    }, [user]);

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
                <ManageUsers />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <VolunteerRoles />
            </TabPanel>
        </>
    );
};

export default VolunteerManagement;
