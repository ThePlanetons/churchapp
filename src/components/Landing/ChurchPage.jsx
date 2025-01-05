import React from 'react';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

export function ChurchPage() {
  return (
    <main className="flex flex-col p-8 bg-white" role="main">
      <Header />
      <section className="flex flex-col items-center px-20 pt-1 mt-8 bg-white rounded-xl max-md:px-5 max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/4f3daa8442124f5a8036db8b3613459e/e3a60f8d9b8a9b2154ad348aa35bdffbe0fb3b50665290c91704fdd4c13e58ce?apiKey=4f3daa8442124f5a8036db8b3613459e&"
          className="object-contain w-full aspect-[2.97] max-w-[1400px]  max-md:max-w-full"
          alt="Church Banner"
        />
      </section>
      <section className="flex flex-row px-0.8 pt-1  mt-4 w-full bg-white max-md:max-w-full">
        <div className="self-center w-full max-w-[1400px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">  
            <div className="flex flex-col w-[69%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
              <h1 className="self-center text-3xl font-extrabold leading-tight text-center text-black max-md:text-center max-md:mr-0 mr-7">
                Church Happens Here
              </h1>
                <div className="flex overflow-hidden  flex-col mt-11 rounded-xl bg-white bg-opacity-0 shadow-[0px_4px_8px_rgba(0,0,0,0.17)] max-md:mt-10 max-md:max-w-full">
                  {/* <img
                    loading="lazy"
                    src="https://youtu.be/4wIYopgrDMI?si=-smRjdTRV5SeL4LR"
                    className="object-contain w-full rounded-xl aspect-[1.78] shadow-[0px_4px_8px_rgba(0,0,0,0.17)] max-md:max-w-full"
                    alt="Church Service"
                  /> */}
                  <iframe width="1080" height="630" src="https://www.youtube.com/embed/4wIYopgrDMI?si=77BXANPhvhExmxAI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
                          <div key={index} className={`z-10 ${index > 1 ? '-mt-3.5' : ''}`}>
                            Stay Connected
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <nav className="flex flex-col gap-4">
                  <button className="flex gap-5 justify-between px-4 py-5 mt-6 rounded-xl bg-white bg-opacity-0 shadow-[0px_4px_8px_rgba(0,0,0,0.17)] max-md:mx-2">
                    <span className="font-medium">Prayer Requests</span>
                    <span className="self-start font-black leading-none text-center"></span>
                  </button>
                  <button className="flex gap-5 justify-between px-4 py-6 rounded-xl bg-white bg-opacity-0 shadow-[0px_4px_8px_rgba(0,0,0,0.17)] max-md:mx-2">
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
}