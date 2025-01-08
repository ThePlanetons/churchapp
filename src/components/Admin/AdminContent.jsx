import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import User from './User/User';
import { MemberContent } from './Member/MemberContent';
import Collections from './Collections/Collections';


function AdminContent() {
  return (
    <main className='m-4 sm:m-6 lg:m-7'>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="member" element={<MemberContent />} />
        <Route path="user" element={<User />} />
        <Route path="collections" element={<Collections />} />
      </Routes>
    </main>
  );
}

export default AdminContent;