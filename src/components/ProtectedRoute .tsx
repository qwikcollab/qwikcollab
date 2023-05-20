import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import useAuthToken from '../hooks/useAuthToken';
import { useUsersStore } from '../store/UsersStore';

export default function ProtectedRoute({ children }: { children: any }) {
  const profile = useUsersStore((state) => state.profile);
  const [setupProfile] = useAuthToken();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (profile) {
      setLoading(false);
      setIsAuthenticated(true);
      return;
    }
    setupProfile().then((value) => {
      setLoading(false);
      setIsAuthenticated(value);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return children;
}
