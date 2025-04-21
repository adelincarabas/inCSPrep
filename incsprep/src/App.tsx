import { useState } from 'react'
import './App.css'
import MenuButton from './components/menuButton'
import DsaExercise from './components/DsaExcerciseCard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <MenuButton text="wow"/>
        <DsaExercise />
      </div>
    </>
  )
}

export default App
