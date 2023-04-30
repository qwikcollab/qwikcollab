import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/LocalStore';
import { useEffect, useState } from 'react';
import { HttpClient, routes } from '../HttpClient';
import { setProfileState } from '../store/UsersStore';

// @ts-ignore
export default function ProtectedRoute({ children }) {
  const token = getToken();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (getToken()) {
      HttpClient.get(routes.profile)
        .then((response) => {
          setProfileState(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (!token) {
    return <Navigate to={'/'} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}
