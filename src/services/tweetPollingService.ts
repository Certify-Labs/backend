import getScraper from "../utils/scraper";
import * as fs from "fs";
import * as path from "path";

const POLL_INTERVAL = 60000; // Poll every 60 seconds
const OUTPUT_FILE = path.join(__dirname, "../../data/tweets.json");
const USERNAME = process.env.TWITTER_USERNAME || ""; // Target username

if (!USERNAME) {
  throw new Error("Please set TWITTER_USERNAME in .env");
}

/**
 * Fetch tweets for the specified username and log actions.
 */
const fetchTweets = async () => {
  try {
    console.log(`Fetching tweets for user: ${USERNAME}`);
    const scraper = await getScraper();
    const tweets = [];

    // Fetch latest 10 tweets
    for await (const tweet of scraper.getTweets(USERNAME, 10)) {
      tweets.push(tweet);
    }

    console.log(`Fetched ${tweets.length} tweets.`);

    // Save tweets to file
    saveTweets(tweets);

    // Perform actions if conditions are met
    tweets.forEach((tweet:any) => {
      if (tweet.text.includes("specific keyword")) {
        console.log(`Condition met for tweet: ${tweet.text}`);
        performAction(tweet);
      }
    });
  } catch (error) {
    console.error("Error fetching tweets:", error);
  }
};

/**
 * Save tweets to a JSON file.
 */
const saveTweets = (tweets: any[]) => {
  const existingTweets = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8") || "[]")
    : [];

  // Merge new tweets with existing tweets
  const allTweets = [...existingTweets, ...tweets];

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTweets, null, 2), "utf-8");
  console.log(`Tweets saved to ${OUTPUT_FILE}`);
};

/**
 * Perform an action when a condition is met.
 */
const performAction = (tweet: any) => {
  console.log(`Performing action for tweet ID: ${tweet.id}`);
  // Example: Send a reply or log a special message
  console.log(`Replying to tweet: ${tweet.text}`);
  // You can implement further custom logic here
};

/**
 * Start polling tweets periodically.
 */
export const startTweetPolling = () => {
  console.log("Starting tweet polling...");
  setInterval(fetchTweets, POLL_INTERVAL);
};
