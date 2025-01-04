import axios from "axios";
import { Question, QuizResponse, GenerateOptions } from "../types";
import { JsonParser } from "../utils/jsonParser";
import { FileSystemManager } from "../utils/fileSystem";
import { PromptGenerator } from "./promptGenerator";

export class OllamaService {
  private fileSystem: FileSystemManager;
  private static readonly REQUIRED_QUESTIONS = 10;

  constructor(
    private baseUrl: string = "http://localhost:11434",
    private model: string = "llama3.2",
    outputDir: string = "output"
  ) {
    this.fileSystem = new FileSystemManager(outputDir);
  }

  async generateQuestions(
    transcript: string,
    saveToFile: boolean = false,
    filename: string = "quiz"
  ): Promise<QuizResponse> {
    try {
      console.log("Sending request to Ollama...");
      const prompt = PromptGenerator.generateInitialPrompt(
        transcript,
        OllamaService.REQUIRED_QUESTIONS
      );

      const response = await this.makeOllamaRequest(prompt);
      console.log("Received response from Ollama");

      let questions = await this.processResponse(response.data.response);

      if (saveToFile) {
        const filePath = await this.fileSystem.saveToJson(
          questions,
          filename,
          this.model
        );
        return { questions, filePath };
      }

      return { questions };
    } catch (error: any) {
      console.error("Ollama request failed:", error.message);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }

  private async makeOllamaRequest(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<any> {
    return axios.post(`${this.baseUrl}/api/generate`, {
      model: this.model,
      prompt,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
        top_p: options.top_p ?? 0.9,
      },
    });
  }

  private async processResponse(result: string): Promise<Question[]> {
    let questions: Question[] | null = null;

    const jsonContent = JsonParser.extractJSON(result);
    if (jsonContent) {
      questions = JsonParser.validateAndTransformQuestions(jsonContent);
    }

    if (!questions || questions.length < OllamaService.REQUIRED_QUESTIONS) {
      questions = await this.reformatQuestions(
        result,
        OllamaService.REQUIRED_QUESTIONS
      );
    }

    return questions;
  }

  private async reformatQuestions(
    text: string,
    requiredCount: number,
    maxRetries: number = 3
  ): Promise<Question[]> {
    console.log("Attempting to reformat questions...");
    let attempts = 0;
    let lastError: string = "";
    let lastPartialSuccess: Question[] | null = null;

    while (attempts < maxRetries) {
      attempts++;
      console.log(`Reformat attempt ${attempts} of ${maxRetries}...`);

      try {
        const questionMatch = text.match(/\"question\"\s*:\s*\"([^\"]+)\"/);
        const answerMatch = text.match(/\"correct_answer\"\s*:\s*\"([^\"]+)\"/);
        const temperature = Math.max(0.1, 0.7 - attempts * 0.2);

        const prompt = PromptGenerator.generateReformatPrompt(
          text,
          requiredCount,
          questionMatch,
          answerMatch,
          lastPartialSuccess
        );

        const response = await this.makeOllamaRequest(prompt, { temperature });
        const result = response.data.response;
        console.log(`Reformat attempt ${attempts} result:`, result);

        const jsonContent = JsonParser.extractJSON(result);
        if (!jsonContent) {
          throw new Error(
            "Could not extract valid JSON from reformatted response"
          );
        }

        const parsed = JsonParser.validateAndTransformQuestions(jsonContent);
        if (!parsed) {
          throw new Error("Reformatted questions failed validation");
        }

        if (parsed.length < requiredCount) {
          lastPartialSuccess = parsed;
          throw new Error(
            `Only generated ${parsed.length}/${requiredCount} questions`
          );
        }

        return parsed;
      } catch (error: any) {
        lastError = error.message || "Unknown error occurred";
        console.error(`Reformat attempt ${attempts} failed:`, lastError);

        if (attempts === maxRetries) {
          throw new Error(
            `Failed to format questions after ${maxRetries} attempts${
              lastError ? `: ${lastError}` : ""
            }`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new Error("Failed to format questions properly");
  }
}
