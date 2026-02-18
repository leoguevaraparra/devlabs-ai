export enum Difficulty {
  EASY = 'Junior',
  MEDIUM = 'Semi-Senior',
  HARD = 'Senior'
}

export enum Category {
  LOGIC = 'Lógica',
  ALGORITHMS = 'Algoritmos',
  DATA_STRUCTURES = 'Estructuras de Datos',
  CONDITIONALS = 'Condicionales',
  LOOPS = 'Bucles'
}

export enum ProgrammingLanguage {
  PYTHON = 'python'
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: Difficulty;
  category: Category;
  language: ProgrammingLanguage;
  initialCode: string;
  hints: string[];
}

export interface EvaluationResult {
  passed: boolean;
  score: number;
  feedback: string;
  consoleOutput: string;
  suggestions: string[];
}

export interface LtiLaunchData {
  userId: string;
  roles: string; // e.g. "Learner", "Instructor"
  contextId: string; // ID del curso en Moodle
  contextLabel: string; // Nombre corto del curso
  outcomeServiceUrl?: string; // URL para devolver la nota
  resultSourcedId?: string; // Token único para la nota del estudiante
  ltik?: string; // LTI Session Token (Bypass Cookies)
}

export interface MoodleState {
  isConnected: boolean;
  ltiData: LtiLaunchData | null;
  lastGradeSent: number | null;
  lastGradeTime: string | null;
}