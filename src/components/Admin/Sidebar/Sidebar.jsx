import React from 'react';
import { Home, Users, Layers, HelpCircle } from 'lucide-react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SidebarItem from './SidebarItem';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-300">
      <div className="p-5">
        <h1 className="text-xl font-semibold">Church Name</h1>
      </div>

      <nav className="px-4">
        <SidebarItem icon={<Home />} text="Home" to="/admin/dashboard" active />
        <SidebarItem icon={<Users />} text="Member" to="/admin/member" />
        {/* <SidebarItem icon={<PersonOutlineIcon />} text="User" to="/admin/member" /> */}
        <SidebarItem icon={<Layers />} text="Collection" to="/collection" />
        <SidebarItem icon={<HelpCircle />} text="Help" to="/help" />
      </nav>
    </div>
  );
}

export default Sidebar;