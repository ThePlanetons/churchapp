import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import { MemberContent } from './Member/MemberContent';

function AdminContent() {
  return (
    <main className='m-4 sm:m-6 lg:m-7'>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="member" element={<MemberContent />} />
      </Routes>
    </main>
  );
}

export default AdminContent;