import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from './CodeEditor'

const DsaExercise: React.FC = () => {
  const { title } = useParams();
  const [exercise, setExercise] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch('http://localhost:5185/api/dsa');
        const data = await response.json();

        const formattedTitle = title?.toLowerCase().replace(/\s+/g, '');
        const found = data.find((e: any) =>
          e.title.replace(/\s+/g, '').toLowerCase() === formattedTitle
        );

        setExercise(found || null);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [title]);

  if (loading) {
    return <p>Loading exercises...</p>;
  }

  return (
    <div className="exercise-card">
      <h2>{exercise.title}</h2>
      <p><strong>ID:</strong> {exercise.id}</p>
      <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
      <p><strong>Description:</strong> {exercise.description}</p>
      <p><strong>Test Cases:</strong> {exercise.testCases}</p>
      <CodeEditor defaultCode={exercise.template} exercise={exercise} />
    </div>
  );
};

export default DsaExercise;