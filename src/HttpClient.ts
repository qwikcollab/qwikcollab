import axios from 'axios';
import { getToken } from './utils/LocalStore';
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const HttpClient = axios.create({
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: getToken()
    }
  },
  withCredentials: true
});

export const setAuthorizationHeader = (value: string) => {
  HttpClient.defaults.headers.common['Authorization'] = value;
};

export const routes = {
  register: `${apiEndpoint}/auth/register`,
  registerGoogle: `${apiEndpoint}/auth/register/google`,
  profile: `${apiEndpoint}/profile`,
  collabSession: `${apiEndpoint}/collab-sessions`
};
