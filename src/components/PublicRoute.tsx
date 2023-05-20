import { isTokenExpired } from '../utils/utils';
import { getToken } from '../utils/LocalStore';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }: { children: any }) {
  if (!isTokenExpired(getToken())) {
    return Navigate({ to: '/dashboard' });
  }

  return children;
}
