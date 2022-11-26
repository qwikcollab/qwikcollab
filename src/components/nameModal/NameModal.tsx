export const NameModal = ({ name, setName, modalVisible, setModalVisible }: any) => {
  return (
    <div className={`modal modal-open ${modalVisible ? 'visible' : 'invisible'}`}>
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
            value={name}
            onChange={({ target: { value } }) => setName(value)}
            required
          />
          <div className="modal-action">
            <button className="btn btn-success" onClick={() => name && setModalVisible(false)}>
              {' '}
              Done{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
