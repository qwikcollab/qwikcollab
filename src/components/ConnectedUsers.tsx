import { User } from '../types';
import { User as UserIcon } from 'react-feather';

export const ConnectedUsers = ({ users }: { users: User[] }) => {
  return (
    <div className={'border-green-400 border-2 ml-2 w-full overflow-y-auto h-full'}>
      <div> Connected Users </div>
      {users.map((user, index) => {
        return (
          <div className={'text-2xl text-left pl-2'} key={index}>
            <UserIcon className={'inline text-green mr-2 text-blue-400'} />
            {user.name}
          </div>
        );
      })}
    </div>
  );
};
