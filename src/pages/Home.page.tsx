import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { TypeAnimation } from './TypeAnimation';

export const HomePage = () => {
  return (
    <div className={'font-poppins'}>
      <section>
        <div className={'grid py-8 px-4  mx-auto lg:gap-8 lg:grid-cols-12'}>
          <div className={'place-self-center lg:col-span-7'}>
            <h1
              className={
                'mb-10 max-w-2xl text-3xl font-extrabold leading-none md:text-4xl xl:text-5xl dark:text-white'
              }
            >
              Collaborative editor for busy engineers
            </h1>
            <div>
              <ul className={'mb-10 text-left list-disc text-xl md:text-2xl xl:text-2xl'}>
                <li> Start writing and collaborating with a click of a button</li>
                <li> No registration required </li>
                <li> Easy invites </li>
              </ul>
            </div>
            <div className={'mx-auto'}>
              <Link to={`/code/${uuid()}`}>
                <button data-theme="qc" className="btn btn-primary btn-lg">
                  Start the magic
                </button>
              </Link>
            </div>
            <div></div>
          </div>
          <div className={'lg:col-span-5'}>
            <TypeAnimation />
          </div>
        </div>
      </section>
    </div>
  );
};
