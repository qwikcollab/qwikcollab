import { Link2 as ShareIcon, Copy as CopyIcon } from 'react-feather';
import { useEffect, useState } from 'react';
import Modal from './shared/Modal';
import { updateSessionName, useSessionInfo } from '../store/SessionInfoStore';
import { HttpClient, routes } from '../utils/HttpClient';

export default function Invite() {
  const { session } = useSessionInfo();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const location = window.location.href;

  useEffect(() => {
    setName(session?.name ?? '');
  }, []);

  return (
    <div className={'my-auto mr-2'}>
      <button
        data-theme={'qc'}
        className="btn btn-sm btn-outline btn-secondary"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <ShareIcon className={'mr-1'} size={18} />
        <span>Invite</span>
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div>
          <label className="label">
            <span className="label-text">Copy and share this link with others</span>
          </label>
          <label className="input-group">
            <input readOnly type="text" value={location} className="input w-full max-w-xl" />
            <button
              data-theme={'qc'}
              className={'btn btn-square btn-primary'}
              onClick={() => {
                navigator.clipboard.writeText(location);
              }}
            >
              <CopyIcon />
            </button>
          </label>

          <div className="divider"></div>

          <div className="form-control w-full max-w-xl">
            <label className="label">
              <span className="label-text">Session Name</span>
            </label>
            <label className={'input-group'}>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xl"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <button
                data-theme={'qc'}
                className="btn btn-active btn-primary"
                onClick={async () => {
                  if (!session) {
                    return;
                  }
                  try {
                    const resp = await HttpClient.post(routes.collabSessionId(session.id), {
                      name
                    });
                    alert(`Updated to ${resp.data.name}`);
                    updateSessionName(resp.data.name);
                  } catch (err) {
                    alert("Couldn't update session name");
                  }
                }}
              >
                Update
              </button>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
