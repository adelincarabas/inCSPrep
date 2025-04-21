import React, { useState, useEffect } from 'react';

type DsaExerciseProps = {};

const DsaExercise: React.FC<DsaExerciseProps> = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('http://localhost:5185/api/dsa');
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        setExercises(data);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return <p>Loading exercises...</p>;
  }

  return (
    <div className="exercise-list">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="exercise-card">
          <h2>{exercise.title}</h2>
          <p><strong>ID:</strong> {exercise.id}</p>
          <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
          <p><strong>Description:</strong> {exercise.description}</p>
          <p><strong>Test Cases:</strong> {exercise.testCases}</p>
        </div>
      ))}
    </div>
  );
};

export default DsaExercise;