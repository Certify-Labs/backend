import express from "express";
import dotenv from "dotenv";
import tweetsRoutes from "./routes/tweets";
import transcriptRouter from "./routes/transcripts";
import questionRouter from "./routes/questions";
import erc1155Router from "./routes/erc1155Events";
import encryptRouter from "./routes/encryptData"; // Import the new encrypt route
import { startPolling as startERC1155Polling } from "./services/LearnAndEarnPlatformPollingService";
import { startTweetPolling } from "./services/tweetPollingService";
import courseRouter from "./routes/courses";
import cors from "cors";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api", tweetsRoutes);
app.use("/api/transcripts", transcriptRouter);
app.use("/api/questions", questionRouter);
app.use("/api/erc1155", erc1155Router);
app.use("/api/encrypt", encryptRouter); // Register the new encrypt route

// Start ERC1155 event polling
startERC1155Polling();

// Uncomment to start tweet polling if needed
// startTweetPolling();
app.use("/api", courseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
