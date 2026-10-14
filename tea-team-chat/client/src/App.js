import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import EnhancedChat from './pages/EnhancedChat';
import Profile from './pages/Profile';
import About from './pages/About';
import Mission from './pages/Mission';
import AuthSuccess from './pages/AuthSuccess';

// Components
import PrivateRoute from './components/PrivateRoute';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F5A623',
      light: '#FFD700',
      dark: '#D4A574',
    },
    secondary: {
      main: '#8B6F47',
      light: '#A0826D',
      dark: '#6B4423',
    },
    background: {
      default: '#FFF8E7',
      paper: '#FFFBF0',
    },
    text: {
      primary: '#4A3728',
      secondary: '#8B6F47',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#4A3728',
    },
    h2: {
      fontWeight: 600,
      color: '#4A3728',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <SocketProvider>
            <div className="App">
              <NetworkStatusBanner />
              <KeyboardShortcutsModal />
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#FFF8E7',
                    color: '#4A3728',
                    border: '2px solid #F5A623',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route 
                  path="/chat" 
                  element={
                    <PrivateRoute>
                      <EnhancedChat />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
