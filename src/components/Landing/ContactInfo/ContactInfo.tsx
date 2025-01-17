import React from 'react';

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  detail: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ icon, title, detail }) => {
  return (
    <div className="flex flex-col items-center whitespace-nowrap">
      <div className="text-2xl font-black leading-none">{icon}</div>

      <div className="mt-4 text-lg font-extrabold leading-tight">
        {title}
      </div>
      <div className="self-stretch mt-6 text-xs font-medium">{detail}</div>
    </div>
  );
};
