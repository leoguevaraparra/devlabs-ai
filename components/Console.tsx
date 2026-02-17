import React from 'react';

interface ConsoleProps {
  output: string;
  isError?: boolean;
}

const Console: React.FC<ConsoleProps> = ({ output, isError }) => {
  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between items-center border-b border-gray-800">
        <span>Terminal / Consola</span>
        <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-sm overflow-auto">
        {!output ? (
          <span className="text-gray-600 italic select-none">Esperando ejecución...</span>
        ) : (
          <pre className={`whitespace-pre-wrap ${isError ? 'text-red-400' : 'text-green-400'}`}>
            <span className="text-gray-500 mr-2">$</span>
            {output}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Console;