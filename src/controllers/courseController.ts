import { Request, Response } from "express";
import { FirebaseService } from "../services/firebaseService";
import { handleResponse, handleError } from "../utils/responseHandler";

const firebaseService = new FirebaseService();

export const saveCourse = async (req: Request, res: Response) => {
  try {
    const { courseId, courseData } = req.body;
    if (!courseId || !courseData) {
      return res
        .status(400)
        .json({ success: false, error: "Course ID and data are required" });
    }

    const result = await firebaseService.saveCourse(courseId.toString(), courseData);
    handleResponse(res, result, "Course saved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await firebaseService.getCourseById(courseId);
    handleResponse(res, course, "Course fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};

export const getCoursesByOwner = async (req: Request, res: Response) => {
  try {
    const { ownerAddress } = req.params;
    const courses = await firebaseService.getCoursesByOwner(ownerAddress);
    handleResponse(res, courses, "Courses fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};

export const saveQuestions = async (req: Request, res: Response) => {
  try {
    const { userAddress, videoUrl, questions, videoData, courseId } = req.body;
    const result = await firebaseService.saveQuestions(
      userAddress,
      videoUrl,
      questions,
      videoData,
      courseId
    );
    handleResponse(res, result, "Questions saved successfully");
  } catch (error) {
    handleError(res, error);
  }
};

export const getQuestionsByUser = async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params;
    const questions = await firebaseService.getQuestionsByUserAddress(
      userAddress
    );
    handleResponse(res, questions, "Questions fetched successfully");
  } catch (error) {
    handleError(res, error);
  }
};
