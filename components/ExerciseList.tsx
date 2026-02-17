import React, { useState, useMemo } from 'react';
import { Exercise, Difficulty } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ExerciseListProps {
  exercises: Exercise[];
  selectedId: string;
  onSelect: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, selectedId, onSelect, isOpen = true, onClose }) => {
  const [activeTab, setActiveTab] = useState<Difficulty>(Difficulty.EASY);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex =>
      ex.difficulty === activeTab &&
      (ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [exercises, activeTab, searchTerm]);

  const tabs = [
    { id: Difficulty.EASY, label: 'Junior' },
    { id: Difficulty.MEDIUM, label: 'Semi-Senior' },
    { id: Difficulty.HARD, label: 'Senior' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={clsx(
        "bg-[#18181b] border-r border-[#27272a] flex flex-col h-full font-sans transition-transform duration-300 z-50",
        "fixed inset-y-0 left-0 w-80 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-[#27272a]">
          <h2 className="text-xl font-bold text-white mb-4 tracking-tight">DevLab<span className="text-blue-500">Pro</span></h2>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar ejercicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#27272a] text-sm text-gray-200 rounded-lg pl-9 pr-4 py-2 border border-transparent focus:border-blue-500 focus:bg-[#3f3f46] outline-none transition-all placeholder-gray-500"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#27272a] p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={twMerge(
                  "flex-1 text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-md transition-all",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No se encontraron ejercicios.
            </div>
          ) : (
            filteredExercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onSelect(ex.id)}
                className={clsx(
                  "w-full text-left p-4 rounded-xl transition-all border group relative overflow-hidden",
                  selectedId === ex.id
                    ? "bg-blue-900/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    : "bg-[#27272a]/30 border-transparent hover:bg-[#27272a]/50 hover:border-[#3f3f46]"
                )}
              >
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                    selectedId === ex.id ? "bg-blue-500 text-white" : "bg-[#3f3f46] text-gray-400"
                  )}>
                    {ex.category}
                  </span>
                  {selectedId === ex.id && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_#60a5fa]"></span>
                  )}
                </div>

                <h3 className={clsx(
                  "text-sm font-semibold mb-1 transition-colors relative z-10",
                  selectedId === ex.id ? "text-blue-100" : "text-gray-300 group-hover:text-white"
                )}>
                  {ex.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed relative z-10">
                  {ex.description}
                </p>

                {/* Selection Indicator Background */}
                {selectedId === ex.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent z-0"></div>
                )}
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#27272a] bg-[#18181b]">
          <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold tracking-widest">
            <span>Riwi DevLab Pro v2.0</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExerciseList;