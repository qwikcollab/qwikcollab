import { UsersStore } from '../../utils/UsersStore';
import { useState } from 'react';

const isValidName = (name: string | null | undefined) => {
  return !(!name || name.length < 3);
};

export const NameModal = ({ setName }: any) => {
  const [userName, setUserName] = useState('');

  const submitName = () => {
    if (isValidName(userName)) {
      UsersStore.self.name = userName;
      setName(userName);
    }
  };

  return (
    <div className={`modal modal-open`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Please enter your name</h3>
        <div className="form-control w-full mt-2">
          <label className="label">
            <span className="label-text">What is your name?</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={userName}
            onChange={({ target: { value } }) => setUserName(value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                submitName();
              }
            }}
            required
            autoFocus={true}
          />
          <div className="modal-action">
            <button className="btn btn-success" onClick={submitName}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
