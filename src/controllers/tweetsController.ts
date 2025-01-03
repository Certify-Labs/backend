import { Request, Response } from 'express';
import getScraper from '../utils/scraper';
import { handleResponse, handleError } from '../utils/responseHandler';

export const getTweets = async (req: Request, res: Response) => {
  try {
    const { user, maxTweets } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, error: 'User is required' });
    }

    const scraper = await getScraper();
    const tweets = [];
    for await (const tweet of scraper.getTweets(user, parseInt(maxTweets) || 10)) {
      tweets.push(tweet);
    }

    handleResponse(res, tweets, 'Fetched tweets successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const getLatestTweet = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ success: false, error: 'User is required' });
    }

    const scraper = await getScraper();
    const tweet = await scraper.getLatestTweet(user);

    handleResponse(res, tweet, 'Fetched latest tweet successfully');
  } catch (error) {
    handleError(res, error);
  }
};

export const sendTweet = async (req: Request, res: Response) => {
  try {
    const { text, replyToTweetId } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Tweet text is required' });
    }

    const scraper = await getScraper();
    const result = await scraper.sendTweet(text, replyToTweetId);

    handleResponse(res, result, 'Tweet sent successfully');
  } catch (error) {
    handleError(res, error);
  }
};
