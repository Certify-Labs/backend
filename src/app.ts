import express from "express";
import dotenv from "dotenv";
import tweetsRoutes from "./routes/tweets";
import transcriptRouter from "./routes/transcripts";
import questionRouter from "./routes/questions";

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use("/api", tweetsRoutes);
app.use("/api/transcripts", transcriptRouter);
app.use("/api/questions", questionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
