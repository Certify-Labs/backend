export interface Question {
  question: string;
  options: string[];
  answer: string | number;
}

export interface QuizResponse {
  questions: Question[];
  filePath?: string;
}

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  outputDir: string;
}

export interface GenerateOptions {
  temperature?: number;
  top_p?: number;
}
