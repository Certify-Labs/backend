import { Router } from "express";
import {
  saveCourse,
  getCourseById,
  getCoursesByOwner,
  saveQuestions,
  getQuestionsByUser,
} from "../controllers/courseController";

const router = Router();

// Course routes
router.post("/course", saveCourse);
router.get("/course/:courseId", getCourseById);
router.get("/courses/owner/:ownerAddress", getCoursesByOwner);

// Question routes
router.post("/questions", saveQuestions);
router.get("/questions/user/:userAddress", getQuestionsByUser);

export default router;
