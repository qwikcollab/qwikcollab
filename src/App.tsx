import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.page';
import CodePage from './pages/Code.page';
import SignupPage from './pages/Signup.page';
import NotFoundPage from './pages/NotFound.page';
import Navbar from './components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/Dashboard.page';
import ProtectedRoute from './components/ProtectedRoute ';

function App() {
  console.log('App render');

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/code/:roomId"
            element={
              <ProtectedRoute>
                <CodePage />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
