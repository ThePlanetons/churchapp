import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import { MemberContent } from './Member/MemberContent';

function AdminContent() {
  return (
    <div className='p-4 sm:p-6 lg:p-7'>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="member" element={<MemberContent />} />
      </Routes>
    </div>
  );
}

export default AdminContent;