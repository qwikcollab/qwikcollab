import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from './TypeAnimation';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { HttpClient, routes } from '../HttpClient';
import { setProfile, setToken } from '../utils/LocalStore';
import { Profile } from '../types';
import { UsersStore } from '../utils/UsersStore';

export default function HomePage() {
  const navigate = useNavigate();
  const responseMessage = async (response: CredentialResponse) => {
    const resp = await HttpClient.post(routes.register, { credential: response.credential });
    if (resp.data.token) {
      setToken(resp.data.token);
      const profileResponse = await HttpClient.get(routes.profile);
      const profile: Profile = profileResponse.data;
      setProfile(profile);
      UsersStore.self = { name: profile.name, id: profile.id };
      navigate('/dashboard');
    }
  };
  const errorMessage = () => {
    console.log('error');
  };

  return (
    <div className={'font-poppins'}>
      <section>
        <div className={'grid py-8 px-4 mx-auto lg:gap-8 lg:grid-cols-12'}>
          <div className={'place-self-center lg:col-span-7'}>
            <h1
              className={
                'mb-10 max-w-2xl text-3xl font-extrabold leading-none md:text-4xl xl:text-5xl dark:text-white'
              }
            >
              Collaborative editor for busy engineers
            </h1>
            <div className={'mb-2'}>
              <ul className={'mb-10 text-left list-disc text-xl md:text-2xl xl:text-2xl'}>
                <li> Start writing and collaborating with a click of a button</li>
                <li> No registration required </li>
                <li> Easy invites </li>
              </ul>
            </div>
            <div className={'mb-2'}>
              <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </div>
            <div></div>
          </div>
          <div className={'lg:col-span-5'}>
            <TypeAnimation />
          </div>
        </div>
      </section>
    </div>
  );
}
