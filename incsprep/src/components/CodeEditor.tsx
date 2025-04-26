import React, { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';

/*
for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
*/

type CodeEditorProps = {
  defaultCode: string;
  exercise: any;
};

type ListNode = {
  val: number;
  next: ListNode | null;
};

(window as any).ListNode = function (val: number, next: any = null) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
};
function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;

  const head: ListNode = { val: arr[0], next: null };
  let current: ListNode = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = { val: arr[i], next: null };
    current = current.next;
  }

  return head;
}

function listToArray(node: ListNode | null): number[] {
  const result: number[] = [];
  while (node) {
    result.push(node.val);
    node = node.next;
  }
  return result;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ defaultCode, exercise }) => {
  const [code, setCode] = useState<string>(defaultCode)
  const [testCases, setTestCases] = useState<any[]>(() => {
    return typeof exercise.testCases === 'string'
      ? JSON.parse(exercise.testCases)
      : exercise.testCases;
  });
  const [testResults, setTestResults] = useState<any[]>([]);

  const handleChange = (newCode: string) => {
    setCode(newCode);
  };

  const onSubmitPress = () => {
    try {
      const functionName = exercise.title
        .replace(/\s+/g, '')
        .replace(/^./, (c: string) => c.toLowerCase());

      const fn = (() => {
        const wrappedCode = `
            ${code}
            return ${functionName};
          `;

        return new Function(wrappedCode)();
      })();

      const results = testCases.map((testCase: any, index: number) => {
        const { expected, ...inputs } = testCase;

        //here I complicated a lot
        //to do: create a flag in db to know if it's a linked in or not and then use it in there
        //also move all the related linked list functions somewhere far
        const isLinkedListProblem = exercise.title.toLowerCase().includes('add two numbers');
        const args = Object.values(inputs).map(value => {
          if (isLinkedListProblem && Array.isArray(value) && value.every(v => typeof v === 'number')) {
            return arrayToList(value);
          }
          return value;
        });

        let actual: any;

        try {
          actual = fn(...args);

          if (actual && typeof actual === 'object' && 'val' in actual) {
            actual = listToArray(actual);
          }
        } catch (err) {
          return {
            index,
            passed: false,
            error: (err as Error).message,
            inputs,
            expected,
            actual: null,
          };
        }

        const passed = JSON.stringify(actual) === JSON.stringify(expected);

        return {
          index,
          passed,
          inputs,
          expected,
          actual,
        };
      });

      setTestResults(results);
    } catch (err) {
      console.error('Execution failed:', err);
    }
  };



  return (
    <div className="code-editor-container">
      <AceEditor
        mode="javascript"
        theme="monokai"
        name="code-editor"
        onChange={handleChange}
        value={code}
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="400px"
        wrapEnabled={true}
      />
      <button onClick={onSubmitPress}>Submit</button>
      <div className="test-results">
        {testResults.length > 0 && (
          <>
            <h3>{testResults.every((result) => result.passed) ? 'All Test Cases Passed!' : 'Some Test Cases Failed'}</h3>

            <div className="failed-cases">
              {testResults
                .filter((result) => !result.passed)
                .map((failedTestCase) => (
                  <div key={failedTestCase.index}>
                    <p><strong>Test Case {failedTestCase.index + 1}</strong> failed:</p>
                    <p><strong>Expected:</strong> {JSON.stringify(failedTestCase.expected)}</p>
                    <p><strong>Received:</strong> {JSON.stringify(failedTestCase.actual)}</p>
                    <p><strong>Inputs:</strong> {JSON.stringify(failedTestCase.inputs)}</p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>

  );
};
export default CodeEditor;
