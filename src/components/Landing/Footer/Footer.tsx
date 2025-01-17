import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-8 rounded-t-xl bg-zinc-800 text-white">
      {/* Social Media Icons */}
      <div className="flex justify-center gap-4 py-6">
        <a
          href="#"
          className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity"
          aria-label="Facebook"
        >
          <FacebookIcon fontSize="small" />
        </a>
        <a
          href="#"
          className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon fontSize="small" />
        </a>
        <a
          href="#"
          className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity"
          aria-label="Instagram"
        >
          <InstagramIcon fontSize="small" />
        </a>
        <a
          href="#"
          className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity"
          aria-label="Twitter (X)"
        >
          <XIcon fontSize="small" />
        </a>
      </div>

      {/* Main Navigation */}
      <nav className="flex justify-center gap-6 text-sm uppercase tracking-wider pb-4 px-4">
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          Home
        </a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          About
        </a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          Story
        </a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          Email
        </a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          Locations
        </a>
      </nav>

      {/* Secondary Navigation */}
      <div className="flex justify-center gap-4 text-xs py-2">
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          Contact
        </a>
        <span>|</span>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          Blog
        </a>
        <span>|</span>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          History
        </a>
        <span>|</span>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">
          Awards
        </a>
      </div>

      {/* Green Banner */}
      <div className="bg-[#000000] py-4 mt-4">
        <div className="text-center">
          <p className="text-sm">The Church Co</p>
          <p className="text-xs mt-1">© Church Name | ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
};
