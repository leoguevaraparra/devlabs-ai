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
      passed: { type: Type.BOOLEAN, description: "True si no hay errores PEP8 importantes ni lógicos." },
      score: { type: Type.NUMBER, description: "Score 0-100." },
      feedback: { type: Type.STRING, description: "Feedback corto (max 30 palabras)." },
      consoleOutput: { type: Type.STRING, description: "Simulated execution output or error trace." },
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of max 3 short PEP8/Logic issues."
      }
    },
    required: ["passed", "score", "feedback", "consoleOutput", "suggestions"]
  };

  // PROMPT TOTALMENTE MINIMIZADO PARA AHORRAR TOKENS
  // Solo se envía la ID del ejercicio (o título corto), las reglas estrictas de salida formales, y el código.
  const prompt = `
Task: Validate Python code.
Instructions: ${exercise.instructions}
Code:
${userCode}

Strict Rules:
- JSON output ONLY.
- Feedback: concise Spanish (max 30 words).
- 'suggestions': max 3 short Pylint-style issues.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Usando Flash-Lite para ahorro del 70%
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.1,
        maxOutputTokens: 250 // MAX OUTPUT TOKENS para evitar verbosidad costosa
      }
    });

    // Log estructurado de uso de tokens con estimación de costos
    if (response.usageMetadata) {
      const inputTokens = response.usageMetadata.promptTokenCount;
      const outputTokens = response.usageMetadata.candidatesTokenCount;
      const totalTokens = response.usageMetadata.totalTokenCount;

      // Tarifas de ejemplo Gemini 2.5 Flash-Lite (Mayo 2024 aprox)
      // Flash-Lite es aprox $0.075 / 1M Input y $0.30 / 1M Output
      const CostoPorMillonInputInfo = 0.075;
      const CostoPorMillonOutputInfo = 0.30;

      // Cálculo del costo en dólares
      const estimatedCostUSD = (inputTokens / 1000000) * CostoPorMillonInputInfo +
        (outputTokens / 1000000) * CostoPorMillonOutputInfo;

      // Log en formato JSON para fácil análisis o importación a Excel/Bases de datos
      const usageLog = {
        event: "gemini_api_usage",
        timestamp: new Date().toISOString(),
        model: "gemini-2.5-flash-lite",
        exerciseId: exercise.id,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUSD: parseFloat(estimatedCostUSD.toFixed(7))
      };

      // Se imprime en una sola línea de JSON
      console.log("[GEMINI COST]:", JSON.stringify(usageLog));
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