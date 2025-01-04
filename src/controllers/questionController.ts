import { Request, Response } from "express";
import { YouTubeScraper } from "../utils/youtube-scrapper";
import { OllamaService } from "../utils/ollamaClient";
import { handleResponse, handleError } from "../utils/responseHandler";

export class QuestionController {
  private scraper: YouTubeScraper;
  private ollamaClient: OllamaService;

  constructor() {
    this.scraper = new YouTubeScraper();
    this.ollamaClient = new OllamaService();
  }

  generateQuestions = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
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

      const result = await this.ollamaClient.generateQuestions(
        transcript,
        true,
        "my-quiz"
      );
      console.log(
        `Successfully generated ${result.questions.length} questions`
      );
      console.log(`Saved to: ${result.filePath}`);
      handleResponse(res, result.questions, "Questions generated successfully");
    } catch (error) {
      handleError(res, error);
    }
  };
}
