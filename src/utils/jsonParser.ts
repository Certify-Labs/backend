import { Question } from "../types";

export class JsonParser {
  static extractJSON(text: string): string | null {
    try {
      const matches = text.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g);
      if (!matches) return null;

      for (const match of matches) {
        try {
          JSON.parse(match);
          return match;
        } catch {
          continue;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  static validateAndTransformQuestions(jsonString: string): Question[] | null {
    try {
      const data = JSON.parse(jsonString);

      if (!data?.questions || !Array.isArray(data.questions)) {
        return null;
      }

      const repairedQuestions = data.questions
        .filter(
          (q: any) =>
            typeof q.question === "string" &&
            Array.isArray(q.options) &&
            q.options.length > 0 &&
            q.options.every((opt: any) => typeof opt === "string") &&
            (typeof q.answer === "number" || typeof q.answer === "string") &&
            !isNaN(Number(q.answer))
        )
        .map((q: any) => {
          const options = [...q.options];
          while (options.length < 4) {
            options.push(`Additional option ${options.length + 1}`);
          }
          if (options.length > 4) {
            options.length = 4;
          }

          const answerIndex = Math.min(Math.max(0, Number(q.answer)), 3);

          return {
            question: q.question,
            options,
            answer: answerIndex,
          };
        });

      if (repairedQuestions.length === 0) return null;

      return repairedQuestions.map((q: any) => ({
        question: q.question,
        options: q.options.map(
          (opt: string, i: number) => `${String.fromCharCode(65 + i)}) ${opt}`
        ),
        answer: String.fromCharCode(65 + Number(q.answer)),
      }));
    } catch {
      return null;
    }
  }
}
