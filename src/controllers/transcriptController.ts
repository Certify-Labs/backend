// src/controllers/transcriptController.ts
import { Request, Response } from "express";
import { YouTubeScraper } from "../utils/youtube-scrapper";
import { handleResponse, handleError } from "../utils/responseHandler";

export class TranscriptController {
  private scraper: YouTubeScraper;

  constructor() {
    this.scraper = new YouTubeScraper();
  }

  getTranscript = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { videoUrl, format } = req.body;

      if (!videoUrl) {
        return res.status(400).json({
          success: false,
          error: "Video URL is required",
        });
      }

      let result;

      switch (format) {
        case "plain":
          result = await this.scraper.getPlainTranscript(videoUrl);
          break;
        case "formatted":
          result = await this.scraper.getFormattedTranscript(videoUrl);
          break;
        default:
          result = await this.scraper.getTranscript(videoUrl);
      }

      handleResponse(
        res,
        { transcript: result },
        "Transcript fetched successfully"
      );
    } catch (error) {
      handleError(res, error);
    }
  };
}
