import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { ProgrammingLanguage } from '../types';

// Import Ace builds
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: ProgrammingLanguage;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, readOnly = false }) => {
  const [theme, setTheme] = useState('monokai');

  return (
    <div className="relative w-full h-full flex flex-col border border-gray-700 rounded-md overflow-hidden bg-[#1e1e1e] shadow-2xl">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-[#252526] px-4 py-2 text-xs border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-gray-300 font-bold uppercase">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            {language} 3.10
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-[#3c3c3c] text-gray-300 border-none rounded px-2 py-0.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value="monokai">Monokai</option>
            <option value="dracula">Dracula</option>
            <option value="github">GitHub</option>
          </select>
          <span className="text-gray-500">UTF-8</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <AceEditor
          mode={language.toLowerCase()}
          theme={theme}
          onChange={onChange}
          value={code}
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
          width="100%"
          height="100%"
          readOnly={readOnly}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 4,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace"
          }}
          className="rounded-b-md"
        />
      </div>
    </div>
  );
};

export default CodeEditor;