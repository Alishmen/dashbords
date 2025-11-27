import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Container } from '@mui/material';
import { Dashboard1 } from './components/Dashboard1/Dashboard1';
import { Dashboard2 } from './components/Dashboard2/Dashboard2';
import { Dashboard3 } from './components/Dashboard3/Dashboard3';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function NavigationTabs() {
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (location.pathname === '/dashboard1') setValue(0);
    else if (location.pathname === '/dashboard2') setValue(1);
    else if (location.pathname === '/dashboard3') setValue(2);
  }, [location]);

  return (
    <Tabs
      value={value}
      textColor="inherit"
      indicatorColor="secondary"
      sx={{
        '& .MuiTab-root': {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-selected': {
            color: '#fff',
          },
        },
      }}
    >
      <Tab label="Заболеваемость. ДН" component={Link} to="/dashboard1" />
      <Tab label="Структура смертности" component={Link} to="/dashboard2" />
      <Tab label="Общий показатель смертности" component={Link} to="/dashboard3" />
    </Tabs>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Декомпозиция данных
              </Typography>
            </Toolbar>
            <NavigationTabs />
          </AppBar>

          <Container maxWidth={false} sx={{ mt: 0 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard1" replace />} />
              <Route path="/dashboard1" element={<Dashboard1 />} />
              <Route path="/dashboard2" element={<Dashboard2 />} />
              <Route path="/dashboard3" element={<Dashboard3 />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

