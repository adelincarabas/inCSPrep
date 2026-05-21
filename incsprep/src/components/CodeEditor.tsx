import React, { useState } from 'react'
import Editor from '@monaco-editor/react'

type CodeEditorProps = {
  defaultCode: string
  exercise: any
}
;(window as any).ListNode = function (val: number, next: any = null) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

const CodeEditor: React.FC<CodeEditorProps> = ({ defaultCode, exercise }) => {
  const [code, setCode] = useState<string>(defaultCode)
  const [testCases] = useState<any[]>(() =>
    typeof exercise.testCases === 'string'
      ? JSON.parse(exercise.testCases)
      : exercise.testCases,
  )
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="ide-layout">
      {/* ── Left: problem description ── */}
      <div className="ide-description">
        <div className="ide-description-header">
          <h2>{exercise.title}</h2>
          <span
            className={`difficulty-badge difficulty-${exercise.difficulty?.toLowerCase()}`}
          >
            {exercise.difficulty}
          </span>
        </div>
        <p className="ide-description-body">{exercise.description}</p>

        <div className="ide-testcases-preview">
          <h4>Examples</h4>
          {testCases.slice(0, 2).map((tc: any, i: number) => (
            <div key={i} className="example-block">
              <div>
                <strong>Input:</strong> {JSON.stringify(tc.inputs ?? tc)}
              </div>
              <div>
                <strong>Output:</strong> {JSON.stringify(tc.expected)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: editor + output ── */}
      <div className="ide-right">
        <div className="ide-editor-pane">
          <div className="ide-toolbar">
            <span className="ide-lang-badge">JavaScript</span>
            <button
              className="ide-run-btn"
              onClick={onSubmitPress}
              disabled={isRunning}
            >
              {isRunning ? 'Running…' : '▶ Run'}
            </button>
          </div>
          <Editor
            height="calc(100vh - 258px)"
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
              <span className="ide-placeholder">
                Run your code to see results.
              </span>
            )}
            {isRunning && (
              <span className="ide-placeholder">Running test cases…</span>
            )}
            {error && <span className="ide-error">{error}</span>}
            {testResults.length > 0 && (
              <>
                <div
                  className={`ide-verdict ${allPassed ? 'verdict-pass' : 'verdict-fail'}`}
                >
                  {allPassed
                    ? '✓ All test cases passed!'
                    : '✗ Some test cases failed'}
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
                        Failed — expected{' '}
                        <code>{JSON.stringify(r.expected)}</code>, got{' '}
                        <code>{JSON.stringify(r.actual)}</code>
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
  )
}

export default CodeEditor
