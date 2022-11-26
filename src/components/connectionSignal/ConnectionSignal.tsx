import { CheckCircle, AlertCircle } from 'react-feather';

export const ConnectionSignal = ({ connected }: any) => {
  return (
    <div className={'flex my-2 align-middle'}>
      {connected ? (
        <span>
          <CheckCircle className={'inline text-green-400 align-middle'} />
          <span className={'text-sm text-gray-400'}> Connected</span>
        </span>
      ) : (
        <span>
          <AlertCircle className={'inline text-red-400'} />
          <span className={'text-sm text-gray-400'}> Connecting </span>
        </span>
      )}
    </div>
  );
};
