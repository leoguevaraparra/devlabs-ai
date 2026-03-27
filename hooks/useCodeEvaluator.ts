
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
    
    // Caché en memoria para evitar re-validaciones de código idéntico
    const [evaluationCache, setEvaluationCache] = useState<Record<string, EvaluationResult>>({});

    /**
     * Sends code to the AI service for evaluation.
     * @param exercise - The exercise context (instructions, criteria).
     * @param code - The student's code to evaluate.
     */
    const runEvaluation = async (exercise: Exercise, code: string): Promise<EvaluationResult | null> => {
        // Prevención básica: Código vacío
        if (!code || code.trim() === '') {
            const errResult = { passed: false, score: 0, feedback: "El código no puede estar vacío.", consoleOutput: "", suggestions: [] };
            setEvaluation(errResult);
            return errResult;
        }

        // Prevención básica: Código sin modificar
        if (code.trim() === exercise.initialCode.trim()) {
            const errResult = { passed: false, score: 0, feedback: "No has modificado el código inicial. Intenta resolver el ejercicio.", consoleOutput: "", suggestions: [] };
            setEvaluation(errResult);
            return errResult;
        }

        // Clave única para el caché: Combinación del IDE del ejercicio y el código exacto (limpio de espacios extra al final)
        const cacheKey = `${exercise.id}_${code.trim()}`;
        
        // Verificar si este exacto código ya fue evaluado
        if (evaluationCache[cacheKey]) {
            console.log("[CodeEvaluator] Obteniendo resultado desde caché local (Ahorro del 100%)");
            setEvaluation(evaluationCache[cacheKey]);
            return evaluationCache[cacheKey];
        }

        setIsEvaluating(true);
        setEvaluation(null);
        setError(null);

        try {
            const result = await evaluateCode(exercise, code);

            if (!result) {
                throw new Error("No se recibió respuesta del servicio de evaluación.");
            }

            // Guardar en caché el resultado exitoso
            setEvaluationCache(prev => ({ ...prev, [cacheKey]: result }));
            
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
