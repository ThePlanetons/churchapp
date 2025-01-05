import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ChurchPage } from '../components/Landing/ChurchPage'
import { SignIn } from '../components/SignIn/SignIn'
import { Admin } from '../components/Admin/Admin';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChurchPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;