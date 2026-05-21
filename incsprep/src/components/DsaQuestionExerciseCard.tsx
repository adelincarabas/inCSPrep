import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CodeEditor from './CodeEditor'
import test from '../../credentials.json'
import ReactMarkdown from 'react-markdown'

const DsaQuestionExercise: React.FC = () => {
  const { id } = useParams()
  const [exercise, setExercise] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userCode, setUserCode] = useState<string>('')
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [analyzing, setAnalyzing] = useState<boolean>(false)

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch('http://localhost:5185/api/dsa/questions')
        const data = await response.json()

        console.log(data)
        console.log(id)
        const found = data.find((e: any) => e.id === Number(id))
        console.log(found)
        setExercise(found || null)
      } catch (error) {
        console.error('Failed to fetch exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [id])

  if (loading) {
    return <p>Loading exercises...</p>
  }

  const analyzeWithAI = async () => {
    setAnalyzing(true)
    setAiAnalysis('')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': test.test,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a Senior Developer that doeds an interview. Analyze the student's code solution.
            **Question:** ${exercise?.question}
            **Expected Answer / Concept:** ${exercise?.answer}
            **Student's Code:**
            \`\`\`
            ${userCode}
            \`\`\`
            Please provide:
            1. ✅ **Correctness** – Does it solve the problem? Any bugs?
            2. ⏱️ **Time & Space Complexity** – What is it, and can it be improved?
            3. 💡 **Suggestions** – How could the code be cleaner or more efficient?
            4. 🎯 **Overall Score** – Rate it out of 10 with a brief summary.

            Be encouraging and educational in your tone.`,
            },
          ],
        }),
      })

      const data = await response.json()
      console.log('Full API response:', JSON.stringify(data, null, 2)) // ← add this
      const text = data.content?.[0]?.text || 'No response received.'
      setAiAnalysis(text)
    } catch (error) {
      console.error('AI analysis failed:', error)
      setAiAnalysis('Failed to get AI analysis. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const generateAnswer = async () => {
    analyzeWithAI()
  }

  return (
    <div className="exercise-card">
      <p>
        <strong>Question:</strong> {exercise.question}
      </p>
      <p>
        <strong>Answer:</strong> {exercise.answer}
      </p>
      <p>
        <strong>Your answer:</strong> {exercise.title}
      </p>
      {aiAnalysis && (
        <div className="ai-analysis">
          <strong>AI Feedback:</strong>
          <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
        </div>
      )}
      <button onClick={generateAnswer} disabled={analyzing}>
        {analyzing ? '🤖 Analyzing...' : '🤖 Analyze with AI'}
      </button>
      <CodeEditor defaultCode="" exercise={exercise} />
    </div>
  )
}

export default DsaQuestionExercise
