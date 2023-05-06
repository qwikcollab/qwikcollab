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

HttpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      return (window.location.href = '/');
    }
    return Promise.reject(error);
  }
);

export const routes = {
  register: `${apiEndpoint}/auth/register`,
  registerGoogle: `${apiEndpoint}/auth/register/google`,
  profile: `${apiEndpoint}/profile`,
  collabSession: `${apiEndpoint}/collab-sessions`
};
