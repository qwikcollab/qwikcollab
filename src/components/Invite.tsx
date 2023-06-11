import { Link2 as ShareIcon, Copy as CopyIcon } from 'react-feather';
import { useState } from 'react';
import Modal from './shared/Modal';

export default function Invite() {
  const [modalOpen, setModalOpen] = useState(false);

  const location = window.location.href;
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
            <input readOnly type="text" value={location} className="input w-full" />
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
        </div>
      </Modal>
    </div>
  );
}
