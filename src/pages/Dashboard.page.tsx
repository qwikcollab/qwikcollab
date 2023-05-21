import { useNavigate } from 'react-router-dom';
import { HttpClient, routes } from '../HttpClient';
import { useEffect, useState } from 'react';
import { CollabSession } from '../models/CollabSession';
import PreviousCollabSessions from '../components/PreviousCollabSessions';
import Modal from "../components/shared/Modal";
import { languages } from "../utils/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<CollabSession[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lang, setLang] = useState(languages[0]);

  useEffect(() => {
    HttpClient.get(routes.collabSession).then((response) => {
      setSessions(response.data);
    });
  }, []);

  const createCollabSession = async (lang: string) => {
    const session = await HttpClient.post(routes.collabSession, { lang });
    if (session.data) {
      navigate(`/code/${session.data.id}`, {
        state: { fromDashboard: true }
      });
    } else {
      // TODO: throw a toast
      console.error('error creating session');
    }
  };

  return (
    <div>
      <div className={'flex justify-center items-center'} style={{ height: '45vh' }}>
        <div className={'flex'}>
          <button
            data-theme="qc"
            className="btn btn-primary btn-lg"
            onClick={() => {setModalOpen(true);}}
          >
            Start the magic
          </button>
        </div>
      </div>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div>
          <table className={"table overflow-scroll w-full"}>
            <thead>
              <tr>
                <th colSpan={2} className={"bg-slate-600"}> Choose a language</th>
              </tr>
            </thead>
            <tbody>
              {
                // For example: <tr class="&>*:bg-green-200">
                languages.map((language,i) => {
                  return (
                    <tr key={language.slug}
                        className={`hover ${language.slug === lang.slug ? 'bg-slate-600' : '[&>*]:bg-slate-800'}`}
                        onClick={()=>{ setLang(languages[i]) }}>
                      <td><img src={language.icon} alt={language.name} /> </td>
                      <td className={"text-left"}> { language.name } </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <div className={"flex justify-between mt-1"}>
            <div> You have chosen {lang.name } !! </div>
            <div>
              <button
                data-theme="qc"
                className="btn btn-primary btn-sm"
                onClick={() => { createCollabSession(lang.slug); }}
              >
                Go !
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div
        className={
          'overflow-auto scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-emerald-100 mx-3'
        }
        style={{ height: '40vh' }}
        data-theme="dark"
      >
        {sessions.length ? (
          <PreviousCollabSessions sessions={sessions} />
        ) : (
          <div className={'text-xs text-emerald-200 text-center'}>
            <div className={'my-auto mt-10'}>Your collab sessions will be listed here !!</div>
          </div>
        )}
      </div>
    </div>
  );
}
