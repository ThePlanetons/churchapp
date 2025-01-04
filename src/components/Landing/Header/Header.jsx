import React from 'react';
import churchLogo from '../../../assets/csi.png'

export function Header() {
  const navItems = [
    { label: 'About', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'Help', href: '#' }
  ];

  return (
    <header className="flex overflow-hidden flex-col w-full text-lg font-extrabold tracking-wider leading-none text-white rounded-xl shadow-[0px_4px_8px_rgba(0,0,0,0.17)] max-md:max-w-full">
      <nav className="relative flex justify-center w-full h-[420px]" role="navigation">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/4f3daa8442124f5a8036db8b3613459e/a754b71387c0e90900cc172c4bf0cd1fbe1d4d27c632f1f0d63be49589ba82f1?apiKey=4f3daa8442124f5a8036db8b3613459e&"
          className="inset-0 w-full h-full object-cover"
          alt="church background"
        />

        <div className='absolute top-8 flex flex-row items-center justify-between'>
          <div>
            <img
              loading="lazy"
              src={churchLogo}
              className="h-40 w-50"
              alt="Church Logo"
            />
          </div>

          <div className="flex gap-6 items-center top-10 right-0 px-0 md:px-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="self-stretch my-auto uppercase text-black"
                tabIndex="0"
              >
                {item.label}
              </a>
            ))}

            <button className="flex overflow-hidden flex-col justify-center self-stretch text-sm font-medium tracking-normal leading-5 text-center text-black rounded-2xl shadow-md bg-orange-200 min-h-[45px] min-w-[80px]">
              <span className="flex-1 gap-3 self-stretch py-4 pr-5 pl-4 bg-orange-200 size-full">
                sign in
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}