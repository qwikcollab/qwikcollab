import axios from 'axios';
import { getToken } from './utils/LocalStore';
//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'true';
//axios.defaults.withCredentials = true;

export const HttpClient = axios.create({
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: getToken()
    }
  },
  withCredentials: true
});

export const routes = {
  register: `${import.meta.env.VITE_API_ENDPOINT}/auth/register`,
  profile: `${import.meta.env.VITE_API_ENDPOINT}/profile`
};
