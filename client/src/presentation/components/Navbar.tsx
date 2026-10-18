import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useColorMode } from '../../foundation/theme';
import { useAuthViewModel } from '../hooks';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/profile', label: 'Profile' },
  { to: '/comparison', label: 'Comparison' },
];

export default function Navbar() {
  const { userName, logout, isAuthenticated } = useAuthViewModel();
  const { mode, toggleMode } = useColorMode();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Toolbar sx={{ gap: { xs: 0.5, sm: 1 }, minWidth: 0 }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            color="inherit"
            aria-label="Open navigation"
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              flexGrow: 0,
              mr: { xs: 'auto', md: 3 },
              minWidth: 0,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Clean Architecture</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>CA</Box>
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 1 } }}>
            <Tooltip title={mode === 'light' ? 'Use dark theme' : 'Use light theme'}>
              <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle theme">
                {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={userName ?? 'User'}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                {userName?.trim().charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </Tooltip>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ display: { xs: 'none', lg: 'block' }, maxWidth: 160 }}
            >
              {userName}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: 280, maxWidth: '85vw', bgcolor: 'background.paper' } }}
      >
        <Box p={2.5}>
          <Typography variant="h6" fontWeight={600}>Navigation</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{userName}</Typography>
        </Box>
        <Divider />
        <List sx={{ py: 1 }}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.to}
              component={Link}
              to={link.to}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: 'auto' }}>
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 2 }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
