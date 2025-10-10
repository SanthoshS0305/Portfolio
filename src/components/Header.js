import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      handleClose();
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'writing', label: 'Writing' },
    { id: 'content', label: 'Content' },
    { id: 'about', label: 'Skills and Contact' }
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(54, 54, 54, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(247, 247, 247, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        '& .MuiTypography-root': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src="/profile.jpg"
            alt="Santhosh Senthil"
            sx={{ width: 40, height: 40 }}
          />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            Santhosh Senthil
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  background: 'rgba(54, 54, 54, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(247, 247, 247, 0.1)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  mt: 1,
                  '& .MuiMenuItem-root': {
                    color: '#F7F7F7',
                    '&:hover': {
                      background: 'rgba(46, 96, 93, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }
                  }
                }
              }}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 216, 115, 0.1)'
                    }
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 3 }}>
            {menuItems.map((item) => (
              <Typography
                key={item.id}
                component="a"
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 500,
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#FFD873'
                  }
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
