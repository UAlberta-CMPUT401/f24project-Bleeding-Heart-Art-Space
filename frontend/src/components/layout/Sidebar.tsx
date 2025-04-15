import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { ListItemButton } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BHASLogo from '@assets/BHAS-Logo.png';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useBackendUserStore } from '@stores/useBackendUserStore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@lib/context/ThemeContext';
enum Role {
  VOLUNTEER,
  ARTIST,
  ADMIN,
}

type SideBarItem = {
  name: string;
  route: string;
  icon: React.ReactNode;
  minRole: Role;
}

const sideBarItems: SideBarItem[] = [
  {
    name: 'Overview',
    route: '/overview',
    icon: <HomeIcon />,
    minRole: Role.VOLUNTEER,
  },
  {
    name: 'Calendar',
    route: '/calendar',
    icon: <CalendarMonthIcon />,
    minRole: Role.VOLUNTEER,
  },
  {
    name: 'Volunteer\nManagement',
    route: '/volunteer-management',
    icon: <ManageAccountsIcon />,
    minRole: Role.ADMIN,
  },
  {
    name: 'Event\nRequests',
    route: '/event-requests',
    icon: <QuestionAnswerIcon/>,
    minRole: Role.ARTIST,
  },
]

const drawerWidth = 240;


const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { backendUser } = useBackendUserStore();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

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
        {sideBarItems.map((item, index) => {
          if (
            (item.minRole === Role.VOLUNTEER) ||
            (item.minRole === Role.ARTIST && (backendUser?.can_request_event || backendUser?.is_admin)) ||
            (item.minRole === Role.ADMIN && backendUser?.is_admin)
          ) {
            const isActive = location.pathname === item.route;
            return <ListItem key={index} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.route}
                    sx={{
                      margin: '0.5rem',
                      height: '4rem',
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'action.selected' : 'transparent',
                    }}
                  >
                    {item.icon}
                    <div style={{ whiteSpace: 'pre-line' }} >
                      {item.name}
                    </div>
                  {/* </div> */}
                </ListItemButton>
              </ListItem>
          }
        })}
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
            sx={{
              display: { xs: 'none', md: 'flex' },
            }}
          >
            Bleeding Heart Art Space
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            aria-label="toggle theme"
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {backendUser?.is_admin && (
          <IconButton
            component={Link}
            to={'/notifications'}
          >
            <EmailIcon />
          </IconButton>
          )}
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
