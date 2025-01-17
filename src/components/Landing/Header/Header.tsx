import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import churchLogo from '../../../assets/csi.png';

interface HeaderProps {
  backgroundImage?: string;
}

export const Header: React.FC<HeaderProps> = ({ backgroundImage }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: 'About', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'Help', href: '#' },
  ];

  const defaultBackground =
    'https://cdn.builder.io/api/v1/image/assets/4f3daa8442124f5a8036db8b3613459e/a754b71387c0e90900cc172c4bf0cd1fbe1d4d27c632f1f0d63be49589ba82f1?apiKey=4f3daa8442124f5a8036db8b3613459e&';

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex overflow-hidden flex-col w-full text-lg font-extrabold tracking-wider leading-none text-white rounded-xl shadow-[0px_4px_8px_rgba(0,0,0,0.17)]">
      <nav
        className="relative flex flex-col w-full h-[340px] md:h-[420px]"
        role="navigation"
      >
        <img
          loading="lazy"
          src={backgroundImage || defaultBackground}
          className="inset-0 w-full h-full object-cover"
          alt="Church Background"
        />

        <div className="absolute top-3 flex flex-row items-center justify-between w-full px-4 md:px-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              loading="lazy"
              src={churchLogo}
              className="h-20 w-20 md:h-36 md:w-36"
              alt="Church Logo"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="uppercase text-black hover:text-gray-700"
                tabIndex={0}
              >
                {item.label}
              </a>
            ))}

            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/sign-in"
              sx={{
                color: 'black',
                borderRadius: '2xl',
                boxShadow: 'md',
                backgroundColor: 'orange.200',
              }}
            >
              Sign In
            </Button>
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden items-center gap-4">
            <button className="flex overflow-hidden flex-col justify-center text-xs font-medium text-center text-black rounded-2xl shadow-md bg-orange-200 min-h-[35px] min-w-[70px]">
              <span className="flex-1 gap-3 pr-3 pl-3 bg-orange-200">Sign In</span>
            </button>

            {/* Three-Dot Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-8 h-8 bg-orange-200 text-black rounded-full focus:outline-none"
            >
              <span className="text-xl">⋮</span>
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-20 right-4 w-48 bg-white text-black shadow-lg rounded-lg flex flex-col items-start z-10"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
