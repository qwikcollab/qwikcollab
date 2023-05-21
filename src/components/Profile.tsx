import { useUsersStore } from '../store/UsersStore';
import { clearToken } from '../utils/LocalStore';
import Modal from "./shared/Modal";
import { googleLogout } from "@react-oauth/google";

export default function Profile({ modalOpen, setModalOpen }: any) {
  const profile = useUsersStore((state) => state.profile);

  return (
    <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div>
          <div className={'flex items-center mb-2'}>
            <div className="avatar mr-2">
              <div className="w-12 rounded-full">
                <img
                  src={profile?.picture}
                  alt="Profile picture"
                  className={'w-4 h-4 rounded-full'}
                />
              </div>
            </div>
            <div>
              <div className="font-bold">{profile?.name}</div>
            </div>
          </div>
          <div className={'m-1 text-right'}>
            <button
              className="btn btn-outline btn-sm btn-success"
              onClick={() => {
                googleLogout();
                clearToken();
                window.location.reload();
              }}
            >
              {' '}
              Log Out{' '}
            </button>
          </div>
        </div>
      </Modal>
  );
}
