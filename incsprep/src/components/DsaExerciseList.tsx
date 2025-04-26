import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MenuButton from './MenuButton';

interface DsaExercise {
  id: number
  title: string
  description: string
}

export default function DsaExerciseList() {
  const [exercises, setExercises] = useState<DsaExercise[]>([])

  useEffect(() => {
    fetch('http://localhost:5185/api/dsa')
      .then(res => res.json())
      .then(data => setExercises(data))
  }, [])

  return (
    <div>
      <MenuButton text="wow"/>
      {exercises.map((exercise) => (
        <div key={exercise.id}>
          <Link to={`/exercise/${encodeURIComponent(exercise.title.replace(/\s+/g, '').replace(/^./, c => c.toLowerCase()))}`}>
            {exercise.title}
          </Link>
        </div>
      ))}
    </div>
  )
}
