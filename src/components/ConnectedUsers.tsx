import { RoomUser } from '../types';
import { User as UserIcon } from 'react-feather';
import { COLOR_MAP } from '../utils/utils';
import { createAvatar } from '@dicebear/core';
import * as initials from '@dicebear/initials';

const getAvatar = (name: string) => {
  return createAvatar(initials, {
    seed: name
  }).toDataUriSync();
};

export const ConnectedUsers = ({ users }: { users: RoomUser[] }) => {
  return (
    <>
      {users.map((user, index) => {
        return (
          <div
            className={'flex my-2 align-middle tooltip tooltip-right tooltip-info'}
            data-tip={user.name}
            key={index}
          >
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile picture of user"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  (currentTarget as HTMLImageElement).src = getAvatar(user.name);
                }}
                className={'w-7 h-7 rounded-full border-2'}
                style={{ borderColor: COLOR_MAP[user.preferences?.color ?? ''] }}
              />
            ) : (
              <UserIcon className={'inline text-green mr-2 text-blue-400'} />
            )}
          </div>
        );
      })}
    </>
  );
};
