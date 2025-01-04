import { Router } from "express";
import { TranscriptController } from "../controllers/transcriptController";

const router = Router();
const transcriptController = new TranscriptController();

router.post("/get", transcriptController.getTranscript);

export default router;
