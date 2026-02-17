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
      model: 'gemini-2.0-flash', // Using latest flash model if available or fallback
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.1
      }
    });

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