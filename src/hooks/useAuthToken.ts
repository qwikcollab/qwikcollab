import { HttpClient, routes, setAuthorizationHeader } from '../utils/HttpClient';
import { Profile } from '../types';
import { setProfileState } from '../store/UsersStore';
import { getToken } from '../utils/LocalStore';

export default function useAuthToken() {
  const setupProfile = async () => {
    const token = getToken();
    if (!token) {
      return false;
    }
    setAuthorizationHeader(token);
    try {
      const profileResponse = await HttpClient.get(routes.profile);
      const profile: Profile = profileResponse.data;
      setProfileState(profile);
      return true;
    } catch (err) {
      return false;
    }
  };

  return [setupProfile];
}
