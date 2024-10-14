import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import CreateEvent from './pages/CreateEvent'; // Import your component

const drawerWidth = 240;

const AppLayout: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const menuItems = [
        { text: 'Dashboard', path: '/dashboard' },
        { text: 'Create Event', path: '/create-event' },
        { text: 'View Calendar', path: '/view-calendar' },
        { text: 'Volunteer Management', path: '/volunteer-management' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: '100%' }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer} edge="start">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Bleeding Hearts Art Space
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="persistent"
                anchor="left"
                open={isDrawerOpen}
                sx={{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        position: 'fixed',
                        height: '100%',
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: isDrawerOpen ? '20px' : '20px',
                    paddingRight: !isDrawerOpen ? `${drawerWidth}px` : '20px',
                    transition: 'padding 0.3s ease',
                }}
            >
                <Toolbar />
                <CreateEvent isSidebarOpen={isDrawerOpen} /> {/* Pass isSidebarOpen prop */}
            </Box>
        </Box>
    );
};

export default AppLayout;
