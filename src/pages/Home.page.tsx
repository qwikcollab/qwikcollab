import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from './TypeAnimation';
import {
  CredentialResponse,
  GoogleLogin,
} from '@react-oauth/google';
import { HttpClient, routes, setAuthorizationHeader } from '../HttpClient';
import { setToken } from '../utils/LocalStore';
import { Profile } from '../types';
import { setProfileState } from '../store/UsersStore';

export default function HomePage() {
  const navigate = useNavigate();

  const responseMessage = async (response: CredentialResponse) => {
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
  const errorMessage = () => {
    console.log('error');
  };

  return (
    <div className={'font-poppins'}>
      <section>
        <div
          className={'grid pb-8 pl-4 mx-auto lg:gap-8 md:grid-cols-12 h-full'}
          style={{ height: '85vh' }}
        >
          <div className={'place-self-center md:place-self-center md:col-span-6'}>
            <div
              className={
                'py-10 max-w-2xl  font-extrabold leading-none text-5xl sm:text-7xl  dark:text-white'
              }
            >
              <h1 className={'col-secondary'}>Code</h1>
              <h1>Share</h1>
              <h1 className={'col-secondary'}>Collaborate.</h1>
            </div>
            <div className={'mb-2'}>
              <GoogleLogin
                size={'large'}
                width={'50px'}
                onSuccess={responseMessage}
                onError={errorMessage}
                shape={'square'}
                logo_alignment={'left'}
              />
            </div>
            <div></div>
          </div>
          <div
            className={
              'place-self-center w-4/5 h-4/5  md:col-span-6 md:w-4/5 md:h-1/3 lg:w-2/3 lg:h-2/3'
            }
          >
            <TypeAnimation />
          </div>
        </div>
      </section>
    </div>
  );
}
