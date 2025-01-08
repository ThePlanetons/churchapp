import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white border-b px-6 py-5">
      <MenuIcon className="text-gray-600" />

      <MoreVertIcon className="text-gray-600" />
    </header>
  );
}

{/* <header className="fixed top-0 z-10 start-0 end-0 flex items-stretch shrink-0 bg-white">
<div className="flex justify-between items-stretch lg:gap-4 border-b px-6 py-5">
  <div>
    <MenuIcon className="text-gray-600" />
  </div>

  <div>
    <MoreVertIcon className="text-gray-600" />
  </div>
</div>
</header> */}

export default AdminHeader;