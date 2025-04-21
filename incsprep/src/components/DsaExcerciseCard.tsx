import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor'

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
        console.log(data)
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
        <div key={exercises[0].id} className="exercise-card">
          <h2>{exercises[0].title}</h2>
          <p><strong>ID:</strong> {exercises[0].id}</p>
          <p><strong>Difficulty:</strong> {exercises[0].difficulty}</p>
          <p><strong>Description:</strong> {exercises[0].description}</p>
          <p><strong>Test Cases:</strong> {exercises[0].testCases}</p>
          <CodeEditor defaultCode={exercises[0].template} />
        </div>
    </div>
  );
};

export default DsaExercise;