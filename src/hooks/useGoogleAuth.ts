import { CredentialResponse } from '@react-oauth/google';
import { HttpClient, routes } from '../HttpClient';
import { setToken } from '../utils/LocalStore';
import { useNavigate } from 'react-router-dom';
import useAuthToken from './useAuthToken';

export default function useGoogleAuth() {
  const navigate = useNavigate();
  const [setupProfile] = useAuthToken();
  const googleAuthResponseMessage = async (response: CredentialResponse) => {
    const resp = await HttpClient.post(routes.registerGoogle, { credential: response.credential });
    const token = resp.data.token;
    if (token) {
      setToken(token);
      await setupProfile();
      navigate('/dashboard');
    }
  };

  const googleAuthErrorMessage = () => {
    // TODO: display toast
    console.log('error');
  };

  return [googleAuthResponseMessage, googleAuthErrorMessage];
}
