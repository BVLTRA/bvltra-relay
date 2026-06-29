import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthFlow from './pages/AuthFlow';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Account from './pages/Account';

// Simple check to see if a token exists in local storage
const isAuthenticated = () => {
  return !!localStorage.getItem('gridlock_token');
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <AuthFlow />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;