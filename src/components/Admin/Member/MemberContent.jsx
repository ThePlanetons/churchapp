import React from 'react';
import { PenSquare } from 'lucide-react';
import { MemberList } from './MemberList';
import { useMemberData } from '../hooks/useMemberData';

export function MemberContent() {
  const { members } = useMemberData();

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-0">
            Member List
          </h3>
          <button className="flex items-center px-3 sm:px-4 py-2 bg-amber-100 text-amber-900 rounded-lg text-sm sm:text-base">
            <PenSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Member
          </button>
        </div>

        <MemberList members={members} />
      </div>
    </div>
  );
}