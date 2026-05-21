import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CodeEditor from './CodeEditor'

const DsaExercise: React.FC = () => {
  const { title } = useParams()
  const [exercise, setExercise] = useState<any | null>(null)
  const [allExercises, setAllExercises] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch('http://localhost:5185/api/dsa')
        const data = await response.json()
        const formattedTitle = title?.toLowerCase().replace(/\s+/g, '')
        const found = data.find(
          (e: any) =>
            e.title.replace(/\s+/g, '').toLowerCase() === formattedTitle,
        )
        setAllExercises(data)
        setExercise(found || null)
      } catch (error) {
        console.error('Failed to fetch exercises:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExercise()
  }, [title])

  if (loading) return <p>Loading…</p>
  if (!exercise) return <p>Exercise not found.</p>

  const currentIndex = allExercises.findIndex((e) => e.id === exercise.id)

  return (
    <CodeEditor
      defaultCode={exercise.template}
      exercise={exercise}
      allExercises={allExercises}
      currentIndex={currentIndex}
    />
  )
}

export default DsaExercise
