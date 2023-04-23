import { User } from '../types';
import { User as UserIcon } from 'react-feather';

export const ConnectedUsers = ({ users }: { users: User[] }) => {
  return (
    <div className={'border-green-400 border-2 ml-2 w-full overflow-y-auto h-full'}>
      <div> Connected Users </div>
      {users.map((user, index) => {
        return (
          <div className={'flex text-md text-left pl-2'} key={index}>
            {
              user.picture ?
                <img src={user.picture} alt="Profile picture" className={'w-6 h-6 rounded-full'} /> :
                <UserIcon className={'inline text-green mr-2 text-blue-400'} />
            }
            <span>{user.name}</span>
          </div>
        );
      })}
    </div>
  );
}
