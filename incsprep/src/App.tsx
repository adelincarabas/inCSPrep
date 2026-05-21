import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import DsaExerciseList from './components/DsaExerciseList'
import DsaExerciseCard from './components/DsaExcerciseCard'
import DsaQuestionExercise from './components/DsaQuestionExerciseCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<DsaExerciseList />} />
      <Route path="/exercise/:title" element={<DsaExerciseCard />} />
      <Route path="/questionexercise/:id" element={<DsaQuestionExercise />} />
    </Routes>
  )
}

export default App
