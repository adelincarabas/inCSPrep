import { useState } from 'react'
import './App.css'
import MenuButton from './components/menuButton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <MenuButton text="wow"/>
      </div>
    </>
  )
}

export default App
