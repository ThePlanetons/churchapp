import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 

function SidebarItem({ icon, text, to, active = false }) {
  const location = useLocation(); 

  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer ${
        location.pathname === to ? 'bg-gray-100' : 'hover:bg-gray-50' 
      }`}
    >
      <span className="text-gray-600">{icon}</span>
      <span className={`${active ? 'font-medium' : ''}`}>{text}</span>
    </Link>
  );
}

export default SidebarItem;