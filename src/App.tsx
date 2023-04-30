import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.page';
import CodePage from './pages/Code.page';
import { NotFoundPage } from './pages/NotFound.page';
import { Navbar } from './components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/Dashboard.page';
import ProtectedRoute from './components/ProtectedRoute ';
import { getToken } from './utils/LocalStore';
import { HttpClient, routes } from './HttpClient';
import { setProfileState } from './store/UsersStore';

function App() {
  console.log('App render');

  useEffect(() => {
    if (getToken()) {
      console.log('req started');
      HttpClient.get(routes.profile).then((response) => {
        console.log('req ended');
        setProfileState(response.data);
      });
    }
  }, []);

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
