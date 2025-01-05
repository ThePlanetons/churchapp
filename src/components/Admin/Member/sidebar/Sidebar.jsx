import React from 'react';
import { Home, Users, Layers, HelpCircle } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Church Name</h1>
      </div>
      <nav className="p-4">
        <SidebarItem icon={<Home />} text="Home" />
        <SidebarItem icon={<Users />} text="User" active />
        <SidebarItem icon={<Layers />} text="Collection" />
        <SidebarItem icon={<HelpCircle />} text="Help" />
      </nav>
    </div>
  );
}