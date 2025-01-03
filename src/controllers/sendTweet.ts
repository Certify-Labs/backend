import { Request, Response } from 'express';
import getScraper from '../utils/scraper';
import { handleResponse, handleError } from '../utils/responseHandler';

export const sendTweet = async (req: Request, res: Response) => {
  try {
    const { text, replyToTweetId } = req.body;

    // Validate that the text field is provided
    if (!text) {
      return res.status(400).json({ success: false, error: 'Tweet text is required' });
    }

    // Initialize and get the scraper instance
    const scraper = await getScraper();

    // Call the scraper to send the tweet
    const result = await scraper.sendTweet(text, replyToTweetId);

    // Send a success response
    handleResponse(res, result, 'Tweet sent successfully');
  } catch (error) {
    // Handle any errors
    handleError(res, error);
  }
};
