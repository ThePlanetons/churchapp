import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function AdminHeader() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-5">
      <MenuIcon className="text-gray-600" />

      <MoreVertIcon className="text-gray-600" />
    </header>
  );
}

export default AdminHeader;