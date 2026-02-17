
import { useState } from 'react';
import { Exercise, EvaluationResult } from '../types';
import { evaluateCode } from '../services/geminiService';

export const useCodeEvaluator = () => {
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runEvaluation = async (exercise: Exercise, code: string) => {
        setIsEvaluating(true);
        setEvaluation(null);
        setError(null);
        try {
            const result = await evaluateCode(exercise, code);
            setEvaluation(result);
            return result;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.message || "Error desconocido al evaluar el código.";
            setError(errorMessage);
            return null;
        } finally {
            setIsEvaluating(false);
        }
    };

    const clearEvaluation = () => {
        setEvaluation(null);
        setError(null);
    };

    return { isEvaluating, evaluation, error, runEvaluation, clearEvaluation };
};
