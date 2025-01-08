import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export function MemberHeader() {
  return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-5">
      {/* <div className="flex items-center space-x-4"> */}
        {/* <ChevronLeft className="w-6 h-6 text-gray-600" /> */}
        <MenuIcon className="text-gray-600" />
        {/* <h2 className="text-xl font-semibold">Member Management</h2> */}
      {/* </div> */}

      <MoreVertIcon className="text-gray-600" />
    </div>
  );
}