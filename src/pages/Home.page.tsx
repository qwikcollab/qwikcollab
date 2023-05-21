import { TypeAnimation } from './TypeAnimation';
import { GoogleLogin } from '@react-oauth/google';
import useGoogleAuth from '../hooks/useGoogleAuth';
import InterviewSvg from '../assets/interview.svg';
import HistorySvg from '../assets/history.svg';
import LightningSvg from '../assets/lightning.svg';
import Logo from "../components/Logo";

export default function HomePage() {
  const [googleAuthResponseMessage, googleAuthErrorMessage] = useGoogleAuth();

  return (
    <div style={{background: '#1d2025'}} className={'font-poppins'}>
      <section>
        <div
          className={'grid pb-8 pl-4 mx-auto lg:gap-8 md:grid-cols-12 h-full'}
          style={{ height: '90vh' }}
        >
          <div className={'place-self-center md:place-self-center md:col-span-6'}>
            <div
              className={
                'py-10 max-w-2xl  font-extrabold leading-none text-5xl sm:text-7xl  dark:text-white'
              }
            >
              <h1 className={'text-emerald-50'}>Code.</h1>
              <h1 className={'text-emerald-200'}>Share.</h1>
              <h1 className={'text-emerald-400'}>Collaborate.</h1>
            </div>
            <div className={'mb-2'}>
              <GoogleLogin
                size={'large'}
                width={'50px'}
                onSuccess={googleAuthResponseMessage}
                onError={googleAuthErrorMessage as any}
                shape={'square'}
                logo_alignment={'left'}
              />
            </div>
          </div>
          <div
            className={
              'place-self-center w-4/5 h-4/5  md:col-span-6 md:w-4/5 md:h-1/3 lg:w-2/3 lg:h-2/3'
            }
          >
            <TypeAnimation />
          </div>
        </div>
      </section>
      <section className="py-12 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-8">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Why QwikCollab?</h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                QwikCollab is an open source collaborative code editor that lets you code with anyone, anywhere,
                anytime. 
              </p>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-4/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <img src={LightningSvg} alt="Collaborate" className="shadow-lg rounded max-w-full mx-auto"/>
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">Collaborate with a click of a button</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                    No installation required
                  </p>
                  <p className="mt-2 text-gray-600">
                    Invite anyone to join your coding session with a simple link. No need to install any software or
                    sign up for an account. Just open your browser and start coding together.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-4/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <img src={InterviewSvg} alt="Interview" className="shadow-lg rounded max-w-full mx-auto"/>
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">Take interviews</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                    Test candidates' skills
                  </p>
                  <p className="mt-2 text-gray-600">
                    Conduct live coding interviews with QwikCollab. You can see the candidates' code in real-time, run
                    tests, and chat with them. QwikCollab supports multiple languages and frameworks to suit your needs.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-4/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <img src={HistorySvg} alt="Sessions" className="shadow-lg rounded max-w-full mx-auto"/>
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">View previous sessions</h5>
                  <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                    Replay and review
                  </p>
                  <p className="mt-2 text-gray-600">
                    QwikCollab saves your coding sessions for future reference. You can replay them anytime, see the
                    changes made by each collaborator, and export the code to your local machine or GitHub.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Logo classProps={'w-10 h-10'} />
            <span className="text-xl font-bold">QwikCollab</span>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <a href="#" className="hover:underline mb-2 md:mb-0">About</a>
            <a href="#" className="hover:underline mb-2 md:mb-0">Contact</a>
          </div>
        </div>
        <div
          className="container mx-auto mt-4 border-t border-gray-700 py-4 text-sm flex flex-wrap justify-between items-center">
          <span>© 2023 QwikCollab. All rights reserved.</span>
          <div className="flex space-x-2">
            <a href="#" className="hover:text-gray-300"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-gray-300"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-gray-300"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </footer>

    </div>
  );
}
