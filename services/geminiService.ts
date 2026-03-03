import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Exercise, EvaluationResult } from "../types";

// Helper to clean JSON string if markdown blocks are present
const cleanJsonString = (text: string): string => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
};

export const evaluateCode = async (
  exercise: Exercise,
  userCode: string
): Promise<EvaluationResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Use import.meta.env for Vite

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Schema definition for structured output
  const evaluationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      passed: { type: Type.BOOLEAN, description: "Whether the code is correct and follows PEP 8." },
      score: { type: Type.NUMBER, description: "A score from 0 to 100." },
      feedback: { type: Type.STRING, description: "General feedback." },
      consoleOutput: { type: Type.STRING, description: "Simulated execution output or error trace." },
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of Pylint-style suggestions (e.g., C0103: Variable name doesn't conform to snake_case)."
      }
    },
    required: ["passed", "score", "feedback", "consoleOutput", "suggestions"]
  };

  const prompt = `
    Act as an advanced Python Static Code Analyzer (like Pylint/MyPy) and an Instructor.
    
    Exercise: ${exercise.title}
    Description: ${exercise.description}
    Requirements: 
    ${exercise.instructions}

    ---
    Student Code (Python 3.14):
    ${userCode}
    ---

    Task:
    1. ANALYZE syntax, logic, and PEP 8 compliance.
    2. EXECUTE the code mentally. Capture standard output.
    3. VALIDATE if it solves the exercise instructions.
    4. CHECK for "Clean Code" principles (meaningful names, proper indentation, comments).
    
    Output Rules:
    - 'consoleOutput': The result of running the code. If syntax error, show the traceback.
    - 'suggestions': Provide specific Pylint-like error codes if applicable (e.g., "E0001: Syntax Error", "C0111: Missing docstring").
    - 'score': Deduct points for bad styling even if logic works.
    - Language: Spanish.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using latest flash model if available or fallback
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.1
      }
    });

    // Log estructurado de uso de tokens con estimación de costos
    if (response.usageMetadata) {
      const inputTokens = response.usageMetadata.promptTokenCount;
      const outputTokens = response.usageMetadata.candidatesTokenCount;
      const totalTokens = response.usageMetadata.totalTokenCount;

      // Tarifas de ejemplo (USD por millón de tokens). 
      // NOTA: Debes verificar los precios actuales de gemini-2.5-flash en la documentación oficial de Google.
      const CostoPorMillonInputInfo = 0.15; // Ejemplo: 15 centavos por millón
      const CostoPorMillonOutputInfo = 0.60; // Ejemplo: 60 centavos por millón

      // Cálculo del costo en dólares
      const estimatedCostUSD = (inputTokens / 1000000) * CostoPorMillonInputInfo +
        (outputTokens / 1000000) * CostoPorMillonOutputInfo;

      // Log en formato JSON para fácil análisis o importación a Excel/Bases de datos
      const usageLog = {
        event: "gemini_api_usage",
        timestamp: new Date().toISOString(),
        model: "gemini-2.5-flash", // Importante si luego cambias el modelo dinámicamente
        exerciseTitle: exercise.title, // Para saber qué ejercicio gastó cuántos tokens
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUSD: parseFloat(estimatedCostUSD.toFixed(6)) // Redondeado a 6 decimales
      };

      // Se imprime en una sola línea de JSON
      console.log(JSON.stringify(usageLog));
    }

    const resultText = response.text;

    if (!resultText) {
      throw new Error("No response from AI evaluator.");
    }

    const parsedResult = JSON.parse(cleanJsonString(resultText)) as EvaluationResult;
    return parsedResult;

  } catch (error) {
    console.error("Evaluation Error:", error);
    return {
      passed: false,
      score: 0,
      feedback: "Error de conexión con el motor de análisis estático.",
      consoleOutput: `Traceback (most recent call last):\n  File "evaluator.py", line 1, in <module>\n    ${error}`,
      suggestions: []
    };
  }
};