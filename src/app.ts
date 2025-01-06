import express from "express";
import dotenv from "dotenv";
import tweetsRoutes from "./routes/tweets";
import transcriptRouter from "./routes/transcripts";
import questionRouter from "./routes/questions";
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
app.use("/api", courseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
