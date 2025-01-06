import axios from "axios";
import getScraper from "../utils/scraper";

/**
 * Function to generate a tweet using Ollama API.
 * @param {string} prompt - The prompt to generate the tweet text.
 * @returns {Promise<string>} - The generated tweet text.
 */
const generateTweetUsingOllama = async (prompt: any) => {
  try {
    const response = await axios.post(
      "https://hxxgxmdd-11434.inc1.devtunnels.ms/api/generate",
      {
        model: "llama3.2", // Adjust the model if necessary
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        },
      }
    );

    if (response.data && response.data.response) {
      return response.data.response.trim();
    } else {
      throw new Error("Failed to generate tweet using Ollama.");
    }
  } catch (error: any) {
    console.error("Error generating tweet using Ollama:", error.message);
    throw error;
  }
};

/**
 * Function to tweet about the CourseCreated event.
 * @param {string} metadataURI - The metadata URI of the course.
 */
export const tweetCourseCreated = async (metadataURI: any) => {
  try {
    // Fetch metadata
    const { data } = await axios.get(metadataURI);
    console.log(data);
    // Extract necessary details
    const { name, description, xProfileLink, ownerEduname, isPremium } = data;
    const premiumText = isPremium
      ? "Check out this premium course!"
      : "Don't miss this free course!";

    // Create prompt for Ollama
    const prompt = `
Generate a short tweet tagging the publisher that promotes a new course published on our platform LearnAndEarn.fun. Use the following details:
- Course Name: ${name}
- Description: ${description}
- Publisher Profile: ${xProfileLink || ownerEduname}
- Call-to-action: ${premiumText}
Ensure the tone is engaging and promotional, and include "LearnAndEarn.fun" as the platform link.
    make sure that tweet size is less than twitter limit`;

    console.log("here");

    // Generate tweet using Ollama
    const tweetText = await generateTweetUsingOllama(prompt);

    // Send the tweet
    const scraper = await getScraper();
    const result = await scraper.sendTweet(tweetText);

    console.log("Tweet sent successfully:", result);
  } catch (error: any) {
    console.error("Error sending tweet:", error.message);
  }
};
