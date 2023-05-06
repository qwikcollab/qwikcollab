import { useState } from 'react';
import { HttpClient, routes, setAuthorizationHeader } from '../HttpClient';
import { setToken } from '../utils/LocalStore';
import { Profile } from '../types';
import { setProfileState } from '../store/UsersStore';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (event: { preventDefault: () => void }) => {
    if (!email || !password) return;
    event.preventDefault();
    const resp = await HttpClient.post(routes.register, { email, password });
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

  return (
    <div className={'flex flex-row justify-center items-center'} style={{ height: '80vh' }}>
      <div>
        <form onSubmit={() => false}>
          <div>
            <label> Email </label>
            <input
              type="email"
              name="email"
              placeholder="Type here"
              className="input input-bordered input-secondary w-full max-w-xs"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label> Password </label>
            <input
              type="password"
              name="password"
              placeholder="Type here"
              className="input input-bordered input-secondary w-full max-w-xs"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className={'mt-3'}>
            <button
              type="button"
              name="submit"
              className="btn btn-secondary w-full"
              onClick={(e) => submit(e)}
            >
              {' '}
              Sign Up{' '}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
