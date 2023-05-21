import { CheckCircle, AlertCircle } from 'react-feather';

export const ConnectionSignal = ({ connected }: any) => {
  return (
    <div className={'flex my-2 align-middle justify-end pr-3'}>
      {connected ? (
        <div className={"my-auto"}>
          <CheckCircle className={'inline text-green-400 align-middle'} />
          <span className={'text-sm text-gray-400'}> Online </span>
        </div>
      ) : (
        <div className={"my-auto"}>
          <AlertCircle className={'inline text-red-400'} />
          <span className={'text-sm text-gray-400'}> Offine </span>
        </div>
      )}
    </div>
  );
};
