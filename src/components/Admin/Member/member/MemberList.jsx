import React from 'react';
import { MemberCard } from './MemberCard';

export function MemberList({ members }) {
  return (
    <div className="bg-white rounded-lg shadow">
      {members.map((member, index) => (
        <MemberCard key={index} member={member} />
      ))}
    </div>
  );
}