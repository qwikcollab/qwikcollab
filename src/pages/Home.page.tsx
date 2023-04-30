import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from './TypeAnimation';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { HttpClient, routes, setAuthorizationHeader } from '../HttpClient';
import { setToken } from '../utils/LocalStore';
import { Profile } from '../types';
import { setProfileState } from '../store/UsersStore';

export default function HomePage() {
  const navigate = useNavigate();

  const responseMessage = async (response: CredentialResponse) => {
    const resp = await HttpClient.post(routes.register, { credential: response.credential });
    const token = resp.data.token;
    if (token) {
      setToken(token);
      setAuthorizationHeader(token);
      console.log('request started');
      const profileResponse = await HttpClient.get(routes.profile);
      console.log('request ended');

      const profile: Profile = profileResponse.data;
      setProfileState(profile);
      navigate('/dashboard');
    }
  };
  const errorMessage = () => {
    console.log('error');
  };

  return (
    <div className={'font-poppins'}>
      <section>
        <div
          className={'grid pb-8 px-4 mx-auto lg:gap-8 md:grid-cols-12 h-full'}
          style={{ height: '80vh' }}
        >
          <div className={'place-self-center md:col-span-7'}>
            <div className={"py-10 max-w-2xl  font-extrabold leading-none text-3xl md:text-6xl xl:text-7xl dark:text-white"}>
              <h1>Code</h1>
              <h1>Share</h1>
              <h1>Collaborate.</h1>
            </div>

            <div className={'mb-2'}>
              <GoogleLogin
                size={'large'}
                width={'300px'}
                onSuccess={responseMessage}
                onError={errorMessage}
              />
            </div>
            <div></div>
          </div>
          <div className={'md:col-span-5'}>
            <TypeAnimation />
          </div>
        </div>
      </section>
    </div>
  );
}
