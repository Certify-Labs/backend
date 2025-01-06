import axios from "axios";

/**
 * Function to tweet about the CourseCreated event.
 * @param {string} metadataURI - The metadata URI of the course.
 */
export const tweetCourseCreated = async (metadataURI: string): Promise<void> => {
    try {
      const response = await axios.post(
        "https://hxxgxmdd-3001.inc1.devtunnels.ms/api/tweet/course",
        { metadataURI },
        { headers: { "Content-Type": "application/json" } } // Ensure correct headers
      );
      console.log("Tweet API response:", response.data);
    } catch (error: any) {
      if (error.code === "ECONNREFUSED") {
        console.error("Unable to connect to the API. Ensure the server is running.");
      } else {
        console.error("Error generating tweet using Ollama:", error.message);
      }
      throw error;
    }
  };
  
