import React from 'react';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

import picture1 from '../../assets/1.jpg';
import picture2 from '../../assets/2.jpg';
import picture3 from '../../assets/3.jpg';

interface ChurchPageProps {
  backgroundImage?: string;
}

export const ChurchPage: React.FC<ChurchPageProps> = () => {
  return (
    <main className="flex flex-col p-8 bg-white" role="main">
      <Header />

      <section className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 2xl:gap-20 py-10 px-8">
        <div>
          <img
            className="rounded-2xl shadow-2xl transform transition-transform duration-300 hover:scale-105"
            loading="lazy"
            src={picture1}
            alt="Church Banner 1"
          />
        </div>

        <div>
          <img
            className="rounded-2xl shadow-2xl transform transition-transform duration-300 hover:scale-105"
            loading="lazy"
            src={picture2}
            alt="Church Banner 2"
          />
        </div>

        <div>
          <img
            className="rounded-2xl shadow-2xl transform transition-transform duration-300 hover:scale-105"
            loading="lazy"
            src={picture3}
            alt="Church Banner 3"
          />
        </div>
      </section>

      <section className="flex flex-row px-0.8 pt-1 mt-4 w-full bg-white max-md:max-w-full">
        <div className="self-center w-full max-w-[1400px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[69%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
                <h1 className="self-center text-3xl font-extrabold leading-tight text-center text-black max-md:text-center max-md:mr-0 mr-7">
                  Church Happens Here
                </h1>
                <div className="flex overflow-hidden flex-col mt-11 h-60 rounded-xl bg-opacity-0 shadow-[0px_4px_8px_rgba(0,0,0,0.17)]">
                  <div
                    className="relative w-full overflow-hidden rounded-xl md:h-60"
                    style={{ paddingBottom: '80%' }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/4wIYopgrDMI?si=77BXANPhvhExmxAI"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            <aside className="flex flex-col ml-5 w-[31%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col mt-20 w-full text-base text-black max-md:mt-10">
                <div className="flex overflow-hidden flex-col font-bold">
                  <div className="flex overflow-hidden flex-col">
                    <div className="flex overflow-hidden flex-col">
                      <div className="flex overflow-hidden flex-col items-start pt-2 pr-20 pb-5 pl-0.5 max-md:pr-5">
                        {[1].map((index) => (
                          <div
                            key={index}
                            className={`z-10 ${index > 1 ? '-mt-3.5' : ''}`}
                          >
                            Stay Connected
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <nav className="flex flex-col gap-4">
                  <button className="flex gap-5 justify-between px-4 py-5 mt-5 rounded-xl bg-white bg-opacity-0 shadow-[0px_4px_8px_rgba(0,0,0,0.17)] max-md:mx-2 transform transition-transform duration-300 hover:scale-95">
                    <span className="font-medium">Prayer Requests</span>
                    <span className="self-start font-black leading-none text-center"></span>
                  </button>

                  <button className="flex gap-5 justify-between px-4 py-5 rounded-xl bg-white bg-opacity-0 shadow-[0px_4px_8px_rgba(0,0,0,0.17)] max-md:mx-2 transform transition-transform duration-300 hover:scale-95">
                    <span className="font-medium">Give Online</span>
                    <span className="self-start font-black leading-none text-center"></span>
                  </button>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};
