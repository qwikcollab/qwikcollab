import {CredentialResponse} from "@react-oauth/google";
import {HttpClient, routes, setAuthorizationHeader} from "../HttpClient";
import {setToken} from "../utils/LocalStore";
import {Profile} from "../types";
import {setProfileState} from "../store/UsersStore";
import {useNavigate} from "react-router-dom";

export default function useGoogleAuth() {
  const navigate = useNavigate();
  const googleAuthResponseMessage = async (response: CredentialResponse) => {
    const resp = await HttpClient.post(routes.registerGoogle, { credential: response.credential });
    const token = resp.data.token;
    if (token) {
      setToken(token);
      setAuthorizationHeader(token);
      const profileResponse = await HttpClient.get(routes.profile);

      const profile: Profile = profileResponse.data;
      setProfileState(profile);
      navigate('/dashboard');
    }
  };

  const googleAuthErrorMessage = () => {
    // TODO: display toast
    console.log('error');
  };

  return [googleAuthResponseMessage, googleAuthErrorMessage]
}
