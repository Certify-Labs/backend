// src/routes/questions.ts
import { Router } from "express";
import { QuestionController } from "../controllers/questionController";

const router = Router();
const questionController = new QuestionController();

router.post("/generate", questionController.generateQuestions);
router.get("/:userAddress", questionController.getUserQuestions);

export default router;
