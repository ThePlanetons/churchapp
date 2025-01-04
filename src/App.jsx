import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { ChurchPage } from './components/Landing/ChurchPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChurchPage/>
    </>
  )
}

export default App
