import React from 'react';
import { MoodleState } from '../types';

interface MoodleHeaderProps {
  state: MoodleState;
  onMenuClick?: () => void;
}

const MoodleHeader: React.FC<MoodleHeaderProps> = ({ state, onMenuClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm relative z-50">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-orange-600">moodle - Riwi</span>
            <span className="text-gray-400 text-xs font-mono uppercase tracking-tighter">LTI v1.3</span>
          </div>
          <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>

          <div className="hidden md:flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Curso</span>
            <span className="text-sm font-semibold text-gray-800">
              {state.ltiData?.contextLabel || 'Curso Desconocido'}
            </span>
          </div>

          <div className="hidden md:flex flex-col ml-4">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Estudiante</span>
            <span className="text-sm font-semibold text-gray-800">
              {state.ltiData?.userId || 'Usuario Externo'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {state.lastGradeSent !== null && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-green-600 font-bold uppercase">Sincronizado</span>
              <span className="text-xs font-semibold text-gray-700">{state.lastGradeSent}% enviado</span>
            </div>
          )}

          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${state.isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            <div className={`w-2 h-2 rounded-full ${state.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            {state.isConnected ? 'Conectado' : 'Offline'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodleHeader;