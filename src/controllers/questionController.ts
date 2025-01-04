// QuestionController.ts
import { Request, Response } from "express";
import { YouTubeScraper } from "../utils/youtube-scrapper";
import { OllamaService } from "../utils/ollamaClient";
import { handleResponse, handleError } from "../utils/responseHandler";

export class QuestionController {
  private scraper: YouTubeScraper;
  private ollamaClient: OllamaService;
  private static readonly MAX_RETRIES = 3;

  constructor() {
    this.scraper = new YouTubeScraper();
    this.ollamaClient = new OllamaService();
  }

  generateQuestions = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    let retryCount = 0;

    try {
      const { videoUrl } = req.body;

      if (!videoUrl) {
        return res.status(400).json({
          success: false,
          error: "Video URL is required",
        });
      }

      // Get transcript
      const transcript = await this.scraper.getPlainTranscript(videoUrl);

      while (retryCount < QuestionController.MAX_RETRIES) {
        try {
          const result = await this.ollamaClient.generateQuestions(
            transcript,
            true,
            "my-quiz"
          );

          if (!result.questions || result.questions.length < 10) {
            throw new Error("Insufficient number of questions generated");
          }

          console.log(
            `Successfully generated ${result.questions.length} questions`
          );
          console.log(`Saved to: ${result.filePath}`);

          return handleResponse(
            res,
            result.questions,
            "Questions generated successfully"
          );
        } catch (error: any) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error.message);

          if (retryCount === QuestionController.MAX_RETRIES) {
            throw error;
          }

          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
        }
      }
    } catch (error) {
      handleError(res, error);
    }
  };
}
