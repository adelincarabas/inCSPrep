import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'

type CodeEditorProps = {
  defaultCode: string
  exercise: any
  allExercises?: any[]
  currentIndex?: number
}

;(window as any).ListNode = function (val: number, next: any = null) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

function extractParamNames(template: string): string[] {
  const match = template.match(/function\s+\w+\s*\(([^)]*)\)/)
  if (!match || !match[1].trim()) return []
  return match[1].split(',').map((p) => p.trim())
}

function formatArgs(args: any[], params: string[]): string {
  return args
    .map((arg, i) =>
      params[i] ? `${params[i]} = ${JSON.stringify(arg)}` : JSON.stringify(arg),
    )
    .join(', ')
}

function exerciseUrl(ex: any): string {
  return `/exercise/${encodeURIComponent(
    ex.title.replace(/\s+/g, '').replace(/^./, (c: string) => c.toLowerCase()),
  )}`
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultCode,
  exercise,
  allExercises = [],
  currentIndex = -1,
}) => {
  const navigate = useNavigate()
  const [code, setCode] = useState<string>(defaultCode)
  const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description')
  const [showList, setShowList] = useState(false)
  const [testCases] = useState<any[]>(() =>
    typeof exercise.testCases === 'string'
      ? JSON.parse(exercise.testCases)
      : exercise.testCases,
  )
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paramNames = extractParamNames(defaultCode)
  const prevEx = currentIndex > 0 ? allExercises[currentIndex - 1] : null
  const nextEx = currentIndex < allExercises.length - 1 ? allExercises[currentIndex + 1] : null

  const onSubmitPress = async () => {
    setIsRunning(true)
    setError(null)
    setTestResults([])

    const fnName = exercise.title
      .replace(/\s+/g, '')
      .replace(/^./, (c: string) => c.toLowerCase())

    try {
      const response = await fetch('http://localhost:5185/api/dsa/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, fnName, testCases }),
      })
      const results = await response.json()
      setTestResults(results)
    } catch (e: any) {
      setError(e.message ?? 'Unknown error')
    } finally {
      setIsRunning(false)
    }
  }

  const allPassed = testResults.length > 0 && testResults.every((r) => r.passed)

  return (
    <div className="ide-wrapper">
      {/* ── Top nav bar ── */}
      <div className="ide-nav">
        <div className="ide-nav-left">
          <button className="ide-nav-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          <button className="ide-nav-btn" onClick={() => setShowList(true)}>
            ☰ Problem List
          </button>
        </div>

        <div className="ide-nav-center">
          {currentIndex >= 0 && allExercises.length > 0 && (
            <span className="ide-nav-position">
              {currentIndex + 1} / {allExercises.length}
            </span>
          )}
        </div>

        <div className="ide-nav-right">
          <button
            className="ide-nav-btn"
            disabled={!prevEx}
            onClick={() => prevEx && navigate(exerciseUrl(prevEx))}
          >
            ← Prev
          </button>
          <button
            className="ide-nav-btn"
            disabled={!nextEx}
            onClick={() => nextEx && navigate(exerciseUrl(nextEx))}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ── Main panels ── */}
      <div className="ide-layout">
        {/* Left: problem description */}
        <div className="ide-description">
          <div className="ide-desc-tabs">
            <button
              className={`ide-tab ${activeTab === 'description' ? 'ide-tab--active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`ide-tab ${activeTab === 'hints' ? 'ide-tab--active' : ''}`}
              onClick={() => setActiveTab('hints')}
            >
              Hints
            </button>
          </div>

          <div className="ide-desc-content">
            <div className="ide-problem-header">
              <h2 className="ide-problem-title">{exercise.title}</h2>
              <span className={`difficulty-badge difficulty-${exercise.difficulty?.toLowerCase()}`}>
                {exercise.difficulty}
              </span>
            </div>

            {activeTab === 'description' && (
              <>
                <p className="ide-desc-text">{exercise.description}</p>

                <div className="ide-examples">
                  {testCases.slice(0, 2).map((tc: any, i: number) => (
                    <div key={i} className="ide-example">
                      <p className="ide-example-label">Example {i + 1}:</p>
                      <div className="ide-example-code">
                        <div>
                          <span className="ide-example-key">Input: </span>
                          <span>{formatArgs(tc.args ?? [], paramNames)}</span>
                        </div>
                        <div>
                          <span className="ide-example-key">Output: </span>
                          <span>{JSON.stringify(tc.expected)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'hints' && (
              <p className="ide-desc-text ide-placeholder">No hints available yet.</p>
            )}
          </div>
        </div>

        {/* Right: editor + output */}
        <div className="ide-right">
          <div className="ide-editor-pane">
            <div className="ide-toolbar">
              <span className="ide-lang-badge">JavaScript</span>
              <button className="ide-run-btn" onClick={onSubmitPress} disabled={isRunning}>
                {isRunning ? 'Running…' : '▶ Run'}
              </button>
            </div>
            <Editor
              height="calc(100vh - 308px)"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val ?? '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 2,
              }}
            />
          </div>

          <div className="ide-output-pane">
            <div className="ide-output-header">Output</div>
            <div className="ide-output-body">
              {!isRunning && testResults.length === 0 && !error && (
                <span className="ide-placeholder">Run your code to see results.</span>
              )}
              {isRunning && <span className="ide-placeholder">Running test cases…</span>}
              {error && <span className="ide-error">{error}</span>}
              {testResults.length > 0 && (
                <>
                  <div className={`ide-verdict ${allPassed ? 'verdict-pass' : 'verdict-fail'}`}>
                    {allPassed ? '✓ All test cases passed!' : '✗ Some test cases failed'}
                  </div>
                  {testResults.map((r: any, i: number) => (
                    <div
                      key={i}
                      className={`ide-result-row ${r.passed ? 'result-pass' : 'result-fail'}`}
                    >
                      <strong>Case {i + 1}:</strong>{' '}
                      {r.passed ? (
                        'Passed'
                      ) : (
                        <>
                          Failed — expected <code>{JSON.stringify(r.expected)}</code>, got{' '}
                          <code>{JSON.stringify(r.result)}</code>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Problem list popup ── */}
      {showList && (
        <div className="ide-overlay" onClick={() => setShowList(false)}>
          <div className="ide-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ide-list-modal-header">
              <span>All Problems</span>
              <button className="ide-list-close" onClick={() => setShowList(false)}>✕</button>
            </div>
            <div className="ide-list-modal-body">
              {allExercises.map((ex: any, i: number) => (
                <Link
                  key={ex.id}
                  to={exerciseUrl(ex)}
                  className={`ide-list-item ${ex.id === exercise.id ? 'ide-list-item--active' : ''}`}
                  onClick={() => setShowList(false)}
                >
                  <span className="ide-list-num">{i + 1}.</span>
                  <span>{ex.title}</span>
                  <span className={`ide-list-diff difficulty-${ex.difficulty?.toLowerCase()}`}>
                    {ex.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeEditor
