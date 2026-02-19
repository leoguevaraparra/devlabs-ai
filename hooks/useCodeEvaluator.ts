
import { useState } from 'react';
import { Exercise, EvaluationResult } from '../types';
import { evaluateCode } from '../services/geminiService';

/**
 * Hook to manage code evaluation using the Gemini AI service.
 * Handles the loading state, result storage, and error management.
 */
export const useCodeEvaluator = () => {
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * Sends code to the AI service for evaluation.
     * @param exercise - The exercise context (instructions, criteria).
     * @param code - The student's code to evaluate.
     */
    const runEvaluation = async (exercise: Exercise, code: string): Promise<EvaluationResult | null> => {
        setIsEvaluating(true);
        setEvaluation(null);
        setError(null);

        try {
            const result = await evaluateCode(exercise, code);

            if (!result) {
                throw new Error("No se recibió respuesta del servicio de evaluación.");
            }

            setEvaluation(result);
            return result;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("[CodeEvaluator] Error during evaluation:", err);

            let errorMessage = "Ocurrió un error inesperado al evaluar el código.";

            if (err.message) {
                if (err.message.includes("429")) {
                    errorMessage = "Quota excedida. Por favor espera un momento antes de intentar de nuevo.";
                } else if (err.message.includes("500") || err.message.includes("503")) {
                    errorMessage = "El servicio de IA no está disponible temporalmente. Intenta más tarde.";
                } else {
                    errorMessage = err.message;
                }
            }

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
