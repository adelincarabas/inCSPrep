import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MenuButton from './MenuButton'

interface DsaExercise {
  id: number
  title: string
  description: string
}

interface QuestionExercise {
  id: number
  question: string
  answer: string
  category: string
}

export default function DsaExerciseList() {
  const [exercises, setExercises] = useState<DsaExercise[]>([])
  const [questionExercises, setQuestionExercises] = useState<
    QuestionExercise[]
  >([])

  useEffect(() => {
    fetch('http://localhost:5185/api/dsa/questions')
      .then((res) => res.json())
      .then((data) => setQuestionExercises(data))
  }, [])

  useEffect(() => {
    fetch('http://localhost:5185/api/dsa')
      .then((res) => res.json())
      .then((data) => setExercises(data))
  }, [])

  return (
    <div className="page-content">
      <MenuButton text="wow" />
      {exercises.map((exercise) => (
        <div key={exercise.id}>
          <Link
            to={`/exercise/${encodeURIComponent(exercise.title.replace(/\s+/g, '').replace(/^./, (c) => c.toLowerCase()))}`}
          >
            {exercise.title}
          </Link>
        </div>
      ))}

      {questionExercises.map((exercise) => (
        <div key={exercise.id}>
          <Link to={`/questionexercise/${exercise.id}`}>
            {exercise.question}
          </Link>
        </div>
      ))}
    </div>
  )
}
