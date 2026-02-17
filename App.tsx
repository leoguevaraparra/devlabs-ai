
import React, { useState, useEffect } from 'react';
import { SAMPLE_EXERCISES } from './constants';
import { Exercise } from './types';
import { useLTI } from './hooks/useLTI';
import { useCodeEvaluator } from './hooks/useCodeEvaluator';
import { submitLtiGrade } from './services/moodleService';
import ExerciseList from './components/ExerciseList';
import CodeEditor from './components/CodeEditor';
import Console from './components/Console';
import MoodleHeader from './components/MoodleHeader';

const App: React.FC = () => {
  const { ltiFlow, ltiMessage, moodleState, setMoodleState } = useLTI();
  const { isEvaluating, evaluation, error, runEvaluation, clearEvaluation } = useCodeEvaluator();

  const [currentExercise, setCurrentExercise] = useState<Exercise>(SAMPLE_EXERCISES[0]);
  const [code, setCode] = useState<string>(SAMPLE_EXERCISES[0].initialCode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (error) {
      alert(`Error: ${error}\n\nPor favor verifica tu configuración (API Key) y reinicia el servidor.`);
    }
  }, [error]);

  useEffect(() => {
    setCode(currentExercise.initialCode);
    clearEvaluation();
    // Close sidebar on mobile when exercise is selected
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise.id]);

  const handleExerciseSelect = (id: string) => {
    const ex = SAMPLE_EXERCISES.find(e => e.id === id);
    if (ex) {
      if (code !== currentExercise.initialCode && !window.confirm("¿Cambiar de ejercicio? Se perderán los cambios actuales.")) {
        return;
      }
      setCurrentExercise(ex);
    }
  };

  const handleRunCode = async () => {
    const result = await runEvaluation(currentExercise, code);

    if (result && result.passed && moodleState.isConnected && moodleState.ltiData) {
      await submitLtiGrade(moodleState.ltiData, result.score);
      setMoodleState(prev => ({
        ...prev,
        lastGradeSent: result.score,
        lastGradeTime: new Date().toLocaleTimeString()
      }));
    }
  };

  // Renderizado Condicional para estados de carga LTI
  if (ltiFlow !== 'IDLE') {
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
        <div className="max-w-sm w-full space-y-8 animate-fadeIn">
          <div className="relative">
            <div className="w-24 h-24 bg-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-900/40 relative z-10">
              <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-orange-600/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Conectando Riwi Lab</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <p className="text-gray-500 text-xs font-mono bg-gray-900/50 py-2 px-4 rounded-lg border border-gray-800">
              {ltiMessage}
            </p>
          </div>

          <div className="pt-8 border-t border-gray-800">
            <p className="text-[10px] text-gray-600 text-center uppercase font-bold tracking-[0.2em]">DevLab LTI Advantage Protocol</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-gray-100 font-sans overflow-hidden">
      <MoodleHeader state={moodleState} onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        <ExerciseList
          exercises={SAMPLE_EXERCISES}
          selectedId={currentExercise.id}
          onSelect={handleExerciseSelect}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0f0f11] w-full">
          {/* Top Split: Instructions & Editor */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto lg:overflow-hidden">
            {/* Instructions Panel */}
            <div className="w-full lg:w-[35%] p-5 border-b lg:border-b-0 lg:border-r border-[#27272a] custom-scrollbar lg:overflow-y-auto h-auto lg:h-full">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{currentExercise.title}</h1>
                </div>

                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {currentExercise.category}
                  </span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {currentExercise.difficulty}
                  </span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">{currentExercise.description}</p>

                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 mb-6 shadow-sm">
                  <h3 className="font-bold text-gray-200 mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Instrucciones
                  </h3>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap leading-7 font-medium font-mono">
                    {currentExercise.instructions}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tips del Mentor</h4>
                  {currentExercise.hints.map((hint, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-yellow-500/5 p-3 rounded-lg text-xs text-yellow-500/80 border border-yellow-500/10">
                      <span className="text-lg leading-none">💡</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Panel */}
            <div className="w-full lg:w-[65%] flex flex-col relative bg-[#1e1e1e] min-h-[500px] lg:min-h-0">
              <div className="flex-1 relative flex flex-col">
                <div className="flex-1 relative">
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    language={currentExercise.language}
                  />
                </div>

                <div className="lg:absolute lg:bottom-6 lg:right-6 lg:z-10 w-full lg:w-auto p-4 lg:p-0 bg-[#1e1e1e] lg:bg-transparent border-t lg:border-t-0 border-[#27272a] flex justify-end">
                  <button
                    onClick={handleRunCode}
                    disabled={isEvaluating}
                    className={`
                      flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-xl w-full lg:w-auto justify-center
                      ${isEvaluating
                        ? 'bg-gray-700 cursor-wait text-gray-400'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40 hover:-translate-y-1 active:translate-y-0'}
                    `}
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Analizando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ejecutar & Validar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Split: Console & Feedback */}
          <div className="h-64 flex flex-col lg:flex-row border-t border-[#27272a] bg-[#0f0f11]">
            <div className="w-full lg:w-1/2 p-0 border-b lg:border-b-0 lg:border-r border-[#27272a]">
              <Console
                output={evaluation ? evaluation.consoleOutput : ''}
                isError={evaluation ? !evaluation.passed : false}
              />
            </div>

            <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
              <div className="h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Análisis Estático (Pylint Simulator)
                  </h3>
                  {evaluation && (
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${evaluation.passed ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {evaluation.passed ? 'CLEAN CODE' : 'ISSUES FOUND'}
                    </span>
                  )}
                </div>

                {!evaluation && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4 opacity-50">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="text-sm font-medium tracking-wide">Esperando análisis...</span>
                  </div>
                )}

                {evaluation && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-4 bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
                      <div className="text-center px-4 border-r border-[#27272a]">
                        <span className={`text-3xl font-black ${evaluation.score >= 80 ? 'text-green-400' : 'text-orange-400'}`}>{evaluation.score}</span>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase">Score</span>
                      </div>
                      <p className="text-sm text-gray-300 italic leading-relaxed flex-1">"{evaluation.feedback}"</p>
                    </div>

                    {evaluation.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sugerencias (PEP 8)</h4>
                        {evaluation.suggestions.map((s, i) => (
                          <div key={i} className="text-xs text-gray-400 flex gap-3 items-center bg-[#18181b] p-2.5 rounded border border-[#27272a] hover:border-gray-600 transition-colors">
                            <span className="text-orange-500 font-mono font-bold">⚠</span>
                            <span className="font-mono">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;