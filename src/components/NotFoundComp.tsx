import { useNavigate } from 'react-router-dom';

export default function NotFoundComp(props: {
  line1: string;
  line2: string;
  line3: string;
  goBackLink: string;
}) {
  const navigate = useNavigate();

  // @ts-ignore
  return (
    <div className="w-3/4 m-auto py-16 h-3/4 flex items-center justify-center">
      <div className="p-3 rounded-lg">
        <div className="mockup-code">
          <pre data-prefix="1">
            <code>{props.line1}</code>
          </pre>
          <pre data-prefix="2">
            <code>{props.line2}</code>
          </pre>
          <pre data-prefix="3" className="bg-accent text-warning-content">
            <code>{props.line3}</code>
          </pre>
        </div>
        <button
          data-theme="qc"
          className="btn mt-2 btn-secondary btn-sm"
          onClick={() => {
            navigate(props.goBackLink);
          }}
        >
          Go back
        </button>
      </div>
    </div>
  );
}
