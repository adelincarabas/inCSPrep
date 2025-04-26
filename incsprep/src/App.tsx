import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css';
import DsaExerciseList from './components/DsaExerciseList';
import DsaExerciseCard from './components/DsaExcerciseCard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <Routes>
          <Route path="/" element={<DsaExerciseList />} />
          <Route path="/exercise/:title" element={<DsaExerciseCard />} />
        </Routes>
      </div>
    </>
  )
}

export default App
