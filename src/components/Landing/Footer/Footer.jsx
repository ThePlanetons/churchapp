
// import { ContactInfo } from '../ContactInfo/ContactInfo';

// export function Footer() {
//   const contactDetails = [
//     { icon: "", title: "Call", detail: "1234567" },
//     { icon: "", title: "Find Us", detail: "Church Location" },
//     { icon: "", title: "Giving", detail: "Give Online" },
//     { icon: "", title: "Email", detail: "xyz@gmail.com" }
//   ];

//   return (
//     <footer className="flex flex-col gap-10 items-center px-20 py-11 mt-20 text-center text-white bg-black rounded-xl max-md:px-5 max-md:mt-10 max-md:max-w-full" role="contentinfo">

//       <div className="flex flex-row gap-5">
//         {contactDetails.map((contact, index) => (
//           <ContactInfo
//             key={index}
//             icon={contact.icon}
//             title={contact.title}
//             detail={contact.detail}
//           />
//         ))}
//       </div>

//       <div className="flex flex-row items-center font-medium">
//         {/* <div className="flex gap-5 justify-between self-stretch text-lg leading-none whitespace-nowrap">
//           <div></div>
//           <div></div>
//           <div className="font-black"></div>
//           <div className="my-auto"></div>
//         </div> */}

//         <div className="text-gray-300 text-center">© Church Name.&nbsp;</div>
//         {/* <div className="leading-loose"> The Church Co </div> */}
//         <div className="text-gray-300 text-center">All Rights Reserved</div>
//       </div>
//     </footer>
//   );
// }
import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

export function Footer() {
  return (
    <footer className="w-full mt-8 rounded-t-xl bg-zinc-800 text-white">
      {/* Social Media Icons */}
      <div className="flex justify-center gap-4 py-6">
        <a href="#" className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity">
          <FacebookIcon size={20} />
        </a>
        <a href="#" className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity">
          <WhatsAppIcon size={20} />
        </a>
        <a href="#" className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity">
          <InstagramIcon size={20} />
        </a>
        <a href="#" className="bg-[#91D0C8] p-2 rounded-full hover:opacity-80 transition-opacity">
          <XIcon size={20} />
        </a>
      </div>

      {/* Main Navigation */}
      <nav className="flex justify-center gap-6 text-sm uppercase tracking-wider pb-4 px-4">
        <a href="#" className="hover:text-[#91D0C8] transition-colors">Home</a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">About</a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">Story</a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">email</a>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">Locations</a>
      </nav>

      {/* Secondary Navigation */}
      <div className="flex justify-center gap-4 text-xs py-2">
        <a href="#" className="hover:text-[#91D0C8] transition-colors">Contact</a>
        <span>|</span>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">Blog</a>
        <span>|</span>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">History</a>
        <span>|</span>
        <a href="#" className="hover:text-[#91D0C8] transition-colors">Awards</a>
      </div>

      {/* Green Banner */}
      <div className="bg-[#000000] py-4 mt-4">
        <div className="text-center">
          <p className="text-sm">
          The Church Co
          </p>
          <p className="text-xs mt-1">
            © Church Name | ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};
