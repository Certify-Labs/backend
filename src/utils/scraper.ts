import { Scraper } from 'agent-twitter-client';
import fs from 'fs';
import path from 'path';

// Define the cookie file path
const COOKIE_FILE_PATH = path.join(__dirname, 'cookies.json');

/**
 * Get or create a scraper instance.
 * - If cookies exist and are valid, use them.
 * - Otherwise, log in and cache new cookies.
 */
const getScraper = async () => {
  const scraper = new Scraper();

  // Check if cookie file exists
  if (fs.existsSync(COOKIE_FILE_PATH)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE_PATH, 'utf-8'));
      await scraper.setCookies(cookies);
      console.log('Loaded cookies into scraper.');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error loading cookies:', error.message);
      } else {
        console.error('Error loading cookies:', error);
      }
    }
  }

  // Check if the scraper is logged in
  const isLoggedIn = await scraper.isLoggedIn();
  if (!isLoggedIn) {
    console.log('Not logged in. Logging in with credentials...');
    await scraper.login(
      process.env.TWITTER_USERNAME || '',
      process.env.TWITTER_PASSWORD || '',
      process.env.TWITTER_EMAIL || '',
      process.env.TWITTER_API_KEY || '',
      process.env.TWITTER_API_SECRET_KEY || '',
      process.env.TWITTER_ACCESS_TOKEN || '',
      process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
    );

    // Save new cookies after login
    const cookies = await scraper.getCookies();
    fs.writeFileSync(COOKIE_FILE_PATH, JSON.stringify(cookies, null, 2), 'utf-8');
    console.log('Saved cookies after login.');
  } else {
    console.log('Scraper is already logged in.');
  }

  return scraper;
};

export default getScraper;
