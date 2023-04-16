import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/LocalStore';

// @ts-ignore
export default function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to={'/'} />;
  }

  return children;
}
