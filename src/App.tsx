import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.page';
import CodePage from './pages/Code.page';
import SignupPage from './pages/Signup.page';
import NotFoundPage from './pages/NotFound.page';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/Dashboard.page';
import ProtectedRoute from './components/ProtectedRoute ';
import PublicRoute from './components/PublicRoute';

function App() {

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />
          <Route path="/loader" element={<Loader />} />
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
