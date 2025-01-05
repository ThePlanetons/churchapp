import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { ChurchPage } from '../components/Landing/ChurchPage'
import { SignIn } from '../components/SignIn/SignIn'

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<ChurchPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;