import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from "react";
import { Link, Outlet } from 'react-router-dom';
import BHASLogo from '@assets/BHAS-Logo.png';
import BHASLogoLight from '@assets/BHAS-Logo-White.png'
import { useTheme } from "@mui/material/styles";

type Page = {
  name: string;
  route: string;
}
const pages: Page[] = [
  {
    name: 'Home',
    route: '/',
  },
  {
    name: 'Login',
    route: '/login',
  },
];

const TopBar: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const logo = isDarkMode ? BHASLogo : BHASLogoLight;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>

            <Box className="logo-container" sx={{ display: { xs: 'none', md: 'flex'}, alignItems: 'center' }}>
              <img
                src={logo}
                alt="Logo"
                className="navbar-logo"
                style={{ height: '50px', marginRight: '20px', cursor: 'pointer' }}
              />
            </Box>

            {/* Medium+ Screen Size */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Bleeding Heart Art Space
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end' }}>
              {pages.map((page) => (
                <Button
                  component={Link}
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  to={page.route}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Small Screen Size */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    component={Link}
                    key={page.name} 
                    onClick={handleCloseNavMenu}
                    to={page.route}
                  >
                    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box className="logo-container" sx={{ display: { xs: 'flex', md: 'none'}, alignItems: 'center' }}>
              <img
                src={logo}
                alt="Logo"
                className="navbar-logo"
                style={{ height: '50px', marginRight: '20px', cursor: 'pointer' }}
              />
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Bleeding Heart Art Space
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
}

export default TopBar;
