import React from 'react';

export function SidebarItem({ icon, text, active = false }) {
  return (
    <div
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 cursor-pointer ${
        active ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <span className="text-gray-600">{icon}</span>
      <span className={`${active ? 'font-medium' : ''}`}>{text}</span>
    </div>
  );
}