import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context';
import { useColorMode } from '../theme';

export default function Navbar() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/tasks', label: 'Tasks' },
    { to: '/profile', label: 'Profile' },
    { to: '/comparison', label: 'Comparison' },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{
            flexGrow: 0,
            mr: 4,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
          }}
        >
          Clean Architecture
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle theme">
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
