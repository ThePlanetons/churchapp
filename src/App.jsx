import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// import { ChurchPage } from './components/Landing/ChurchPage'
// import { SignIn } from './components/SignIn/SignIn'

import AppRouter from './routes/AppRouter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
