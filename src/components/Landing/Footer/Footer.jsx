import React from 'react';
import { ContactInfo } from '../ContactInfo/ContactInfo';

export function Footer() {
  const contactDetails = [
    { icon: "", title: "Call", detail: "1234567" },
    { icon: "", title: "Find Us", detail: "Church Location" },
    { icon: "", title: "Giving", detail: "Give Online" },
    { icon: "", title: "Email", detail: "xyz@gmail.com" }
  ];

  return (
    <footer className="flex flex-col gap-10 items-center px-20 py-24 mt-48 text-center text-white bg-black rounded-xl max-md:px-5 max-md:mt-10 max-md:max-w-full" role="contentinfo">

      <div className="flex flex-row gap-5">
        {contactDetails.map((contact, index) => (
          <ContactInfo
            key={index}
            icon={contact.icon}
            title={contact.title}
            detail={contact.detail}
          />
        ))}
      </div>

      <div className="flex flex-row items-center font-medium">
        {/* <div className="flex gap-5 justify-between self-stretch text-lg leading-none whitespace-nowrap">
          <div></div>
          <div></div>
          <div className="font-black"></div>
          <div className="my-auto"></div>
        </div> */}

        <div className="text-gray-300 text-center">© Church Name.&nbsp;</div>
        {/* <div className="leading-loose"> The Church Co </div> */}
        <div className="text-gray-300 text-center">All Rights Reserved</div>
      </div>
    </footer>
  );
}