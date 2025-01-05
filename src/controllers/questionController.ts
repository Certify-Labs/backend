import { Request, Response } from "express";
import { YouTubeScraper } from "../utils/youtube-scrapper";
import { OllamaService } from "../utils/ollamaClient";
import { FirebaseService } from "../services/firebaseService";
import { handleResponse, handleError } from "../utils/responseHandler";

export class QuestionController {
  private scraper: YouTubeScraper;
  private ollamaClient: OllamaService;
  private firebaseService: FirebaseService;
  private static readonly MAX_RETRIES = 3;

  constructor() {
    this.scraper = new YouTubeScraper();
    this.ollamaClient = new OllamaService();
    this.firebaseService = new FirebaseService();
  }

  generateQuestions = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    let retryCount = 0;

    try {
      const { videoUrl, userAddress, videoData, courseId } = req.body;

      if (!videoUrl || !userAddress) {
        return res.status(400).json({
          success: false,
          error: "Video URL and user address are required",
        });
      }

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

          // Save questions to Firebase
          const docId = await this.firebaseService.saveQuestions(
            userAddress,
            videoUrl,
            result.questions,
            videoData,
            courseId
          );

          console.log(
            `Successfully generated ${result.questions.length} questions`
          );
          console.log(`Saved to Firebase with ID: ${docId}`);
          console.log(`Local file saved to: ${result.filePath}`);

          return handleResponse(
            res,
            {
              questions: result.questions,
              docId,
            },
            "Questions generated and saved successfully"
          );
        } catch (error: any) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error.message);

          if (retryCount === QuestionController.MAX_RETRIES) {
            throw error;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
        }
      }
    } catch (error) {
      handleError(res, error);
    }
  };

  getUserQuestions = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userAddress } = req.params;

      if (!userAddress) {
        return res.status(400).json({
          success: false,
          error: "User address is required",
        });
      }

      const questionSets = await this.firebaseService.getQuestionsByUserAddress(
        userAddress
      );

      return handleResponse(
        res,
        questionSets,
        "Questions retrieved successfully"
      );
    } catch (error) {
      handleError(res, error);
    }
  };
}
