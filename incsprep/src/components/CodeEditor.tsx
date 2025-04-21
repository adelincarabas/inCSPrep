import React, { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';

type CodeEditorProps = {
    defaultCode: string;
};

const CodeEditor: React.FC<CodeEditorProps> = ({ defaultCode }) => {
    console.log(defaultCode);
    const [code, setCode] = useState<string>(defaultCode)
  
    const handleChange = (newCode: string) => {
      setCode(newCode);
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
      </div>
    );
  };
export default CodeEditor;
