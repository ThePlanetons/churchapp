import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

export function MemberHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Member Management</h2>
        </div>
        <MoreVertical className="w-6 h-6 text-gray-600" />
      </div>
    </header>
  );
}