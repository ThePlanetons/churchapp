// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ChurchPage } from './components/Landing/ChurchPage'
import { SignIn } from './components/auth/sign-in/sign-in';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './components/admin/dashboard/dashboard';
import MemberManagement from './components/admin/member/member';
import Entity from './components/admin/entity/entity';
import Collation from './components/admin/collation/collation';
import Settings from './components/admin/settings';
import UserManagement from './components/admin/user/user';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChurchPage />} />

        <Route path="/sign-in" element={<SignIn />} />

        {/* Landing routes */}
        {/* <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route> */}

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/members" element={<MemberManagement />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/entity" element={<Entity />} />
          <Route path="/admin/collation" element={<Collation />} />
        </Route>
      </Routes>
    </BrowserRouter>
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  )
}

export default App
