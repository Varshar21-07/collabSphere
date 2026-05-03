import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Placeholder for other pages to make navigation work
const Placeholder = ({ title }) => (
  <div className="glass p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mt-4 text-center">
    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-4">{title}</h1>
    <p className="text-gray-600 dark:text-gray-400">This section is currently under development.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
              }} 
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/teams" element={<Placeholder title="Teams Configuration" />} />
                  <Route path="/channels" element={<Placeholder title="Channel Browser" />} />
                  <Route path="/documents" element={<Placeholder title="Document Repository" />} />
                  <Route path="/messages" element={<Placeholder title="Direct Messages" />} />
                  <Route path="/settings" element={<Placeholder title="User Settings" />} />
                </Route>
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
