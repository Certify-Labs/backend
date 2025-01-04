import { Question } from "../types";

export class PromptGenerator {
  static generateInitialPrompt(
    transcript: string,
    requiredQuestions: number
  ): string {
    return `
        You are a quiz generator. Your task is to create exactly ${requiredQuestions} multiple choice questions.
        
        EXTREMELY IMPORTANT: You must ONLY output valid JSON in EXACTLY this format:
        {
          "questions": [
            {
              "question": "What is being discussed?",
              "options": [
                "Write all HTML first",
                "Style with CSS first",
                "Alternate between HTML and CSS",
                "No correct approach exists"
              ],
              "answer": 3
            }
          ]
        }
  
        RULES:
        1. Output ONLY the JSON above - no other text, no markdown, no explanations
        2. Generate EXACTLY ${requiredQuestions} questions based on the transcript
        3. Each question must have EXACTLY 4 options
        4. Options must be plain strings - no prefixes like "A)" or "1."
        5. Answer must be a number 0-3 indicating the correct option's index
        6. ENSURE the JSON is valid - no trailing commas, proper quotes
        7. If the transcript doesn't provide enough content for ${requiredQuestions} questions,
           create additional related questions about web development best practices and common approaches
  
        DO NOT include any explanations or notes. Output ONLY the JSON structure above with ${requiredQuestions} questions.
  
        Here's the transcript:
        ${transcript}
      `;
  }

  static generateReformatPrompt(
    text: string,
    requiredCount: number,
    questionMatch: RegExpMatchArray | null,
    answerMatch: RegExpMatchArray | null,
    lastPartialSuccess: Question[] | null
  ): string {
    return `
        Convert this content into exactly ${requiredCount} multiple choice questions.
        
        RULES:
        1. Output ONLY this JSON structure - no other text:
        {
          "questions": [
            {
              "question": "Question text?",
              "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
              ],
              "answer": 0
            }
          ]
        }
        
        2. Use this content to create the first question:
        Question: ${questionMatch ? questionMatch[1] : text}
        ${answerMatch ? `Answer: ${answerMatch[1]}` : ""}
        
        3. Create ${
          requiredCount - 1
        } additional related questions about web development best practices
        4. Each question must have exactly 4 plausible options
        5. Set answer (0-3) to point to the correct option
        6. ENSURE you generate exactly ${requiredCount} questions
        7. ENSURE the JSON is valid - no trailing commas, proper quotes
        8. CRITICAL: Your response must be valid JSON only
        
        ${
          lastPartialSuccess
            ? `Previous attempt generated ${lastPartialSuccess.length} valid questions. Please ensure all ${requiredCount} questions are properly formatted.`
            : ""
        }
        
        Output ONLY the JSON structure. No explanations or additional text.
      `;
  }
}
