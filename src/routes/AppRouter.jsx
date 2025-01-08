import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ChurchPage } from '../components/Landing/ChurchPage'
import { SignIn } from '../components/SignIn/SignIn'
import { Admin } from '../components/Admin/Admin';
import { MemberContent } from '../components/Admin/Member/MemberContent';
import Dashboard from '../components/Admin/Dashboard/Dashboard';
import User from '../components/Admin/User/User';
import { Collections } from '@mui/icons-material';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChurchPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/admin/*" element={<Admin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="member" element={<MemberContent />} />
          <Route path="user" element={<User />} />
          <Route path="collections" element={<Collections />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;