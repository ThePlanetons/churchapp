import React from 'react';

export function MemberCard({ member }) {
  return (
    <div className="flex items-center px-6 py-4 border-b last:border-b-0">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
        {member.avatar}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{member.name}</h4>
        <p className="text-sm text-gray-500">{member.email}</p>
      </div>
    </div>
  );
}