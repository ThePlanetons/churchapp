import React from 'react';
import { Home, Users } from 'lucide-react';
import SidebarItem from './SidebarItem';

function Sidebar() {
  return (
    <div className="w-64">
      <div className="p-5">
        <h1 className="text-xl font-semibold">Church Name</h1>
      </div>

      <nav className="px-4">
        <SidebarItem icon={<Home />} text="Home" to="/admin/dashboard" active />
        <SidebarItem icon={<Users />} text="Member" to="/admin/member" />
      </nav>
    </div>
  );
}

export default Sidebar;