import React, { useState } from 'react';

export function MemberCard({ member }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center px-6 py-4 border-b last:border-b-0 cursor-pointer relative ${isHovered ? 'hover:bg-gray-300' : ''}`}
      // onMouseEnter={() => setIsHovered(true)}
      onClick={() => {
        if (isHovered) {
          setIsHovered(false); 
        } else { 
          setIsHovered(true);      
        }
      }}
    //   onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic avatar */}
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
        {member.name?.charAt(0) || 'A'}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{member.first_name}</h4>
        <p className="text-sm text-gray-500">{member.email}</p>
      </div>
      {isHovered && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="px-5 py-3 my-2 bg-amber-100 text-bg-amber-900 text-sm rounded hover:bg-amber-200">
            Edit
          </button>
          <button className="px-3 py-3 my-2 bg-red-500 text-white text-sm rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}