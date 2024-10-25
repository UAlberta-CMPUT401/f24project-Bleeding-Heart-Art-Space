import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Toolbar from '@mui/material/Toolbar';
import { Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BHASLogo from '@assets/BHAS-Logo.png';
import { Link, Outlet } from 'react-router-dom';

type SideBarItem = {
  name: string;
  route: string;
  icon: React.ReactNode;
}

const sideBarItems: SideBarItem[] = [
  {
    name: 'Overview',
    route: '/overview',
    icon: <HomeIcon />,
  },
  {
    name: 'Calendar',
    route: '/calendar',
    icon: <CalendarIcon />,
  },
  {
    name: 'Volunteer\nManagement',
    route: '/volunteer-management',
    icon: <ManageAccountsIcon />,
  },
]

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {sideBarItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <Button
              component={Link}
              variant='contained'
              sx={{
                margin: '0.5rem',
                width: '100%',
                height: '4rem',
                fontWeight: 'bold',
              }}
              to={item.route}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
                <div style={{ whiteSpace: 'pre-line' }} >
                  {item.name}
                </div>
              </div>
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        color="default"
        position="fixed"
        sx={{ zIndex: 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component='img'
            sx={{
              maxHeight: '4rem',
              paddingX: '1rem',
            }}
            src={BHASLogo}
          />
          <Typography 
            variant='h6' 
            noWrap 
            component='div'
            fontWeight='bold'
          >
            Bleeding Heart Art Space
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            component={Link}
            to={'/account'}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { xs: 0, md: drawerWidth }, flexShrink: { sm: 0 }, zIndex: 0 }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
