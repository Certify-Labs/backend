import { Request, Response } from "express";
import { YouTubeScraper } from "../utils/youtube-scrapper";
import { OllamaService } from "../utils/ollamaClient";
import { FirebaseService } from "../services/firebaseService";
import { handleResponse, handleError } from "../utils/responseHandler";
interface CourseDetails {
  id: string;
  title: string;
  category: string;
  rating: number;
  progress: number;
  colorScheme: {
    darker: string;
    lighter: string;
  };
}

interface QuestionSetData {
  videoUrl: string;
  questions: any[];
  videoData: any;
  createdAt: any;
}

interface GroupedQuestions {
  courseDetails: CourseDetails | null;
  questions: QuestionSetData[];
}

interface GroupedQuestionsAccumulator {
  [key: string]: GroupedQuestions;
}

export class QuestionController {
  private scraper: YouTubeScraper;
  private ollamaClient: OllamaService;
  private firebaseService: FirebaseService;
  private static readonly MAX_RETRIES = 3;

  constructor() {
    this.scraper = new YouTubeScraper();
    this.ollamaClient = new OllamaService();
    this.firebaseService = new FirebaseService();
  }

  generateQuestions = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    let retryCount = 0;

    try {
      const { videoUrl, userAddress, videoData, courseId } = req.body;

      if (!videoUrl || !userAddress) {
        return res.status(400).json({
          success: false,
          error: "Video URL and user address are required",
        });
      }

      const transcript = await this.scraper.getPlainTranscript(videoUrl);

      while (retryCount < QuestionController.MAX_RETRIES) {
        try {
          const result = await this.ollamaClient.generateQuestions(
            transcript,
            true,
            "my-quiz"
          );

          if (!result.questions || result.questions.length < 10) {
            throw new Error("Insufficient number of questions generated");
          }

          // Save questions to Firebase
          const docId = await this.firebaseService.saveQuestions(
            userAddress,
            videoUrl,
            result.questions,
            videoData,
            courseId
          );

          console.log(
            `Successfully generated ${result.questions.length} questions`
          );
          console.log(`Saved to Firebase with ID: ${docId}`);
          console.log(`Local file saved to: ${result.filePath}`);

          return handleResponse(
            res,
            {
              questions: result.questions,
              docId,
            },
            "Questions generated and saved successfully"
          );
        } catch (error: any) {
          retryCount++;
          console.error(`Attempt ${retryCount} failed:`, error.message);

          if (retryCount === QuestionController.MAX_RETRIES) {
            throw error;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
        }
      }
    } catch (error) {
      handleError(res, error);
    }
  };

  getUserQuestions = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { userAddress } = req.params;

      if (!userAddress) {
        return res.status(400).json({
          success: false,
          error: "User address is required",
        });
      }

      // Get all question sets for the user
      const questionSets = await this.firebaseService.getQuestionsByUserAddress(
        userAddress
      );

      // Create a map to avoid duplicate course fetches
      const courseDetailsMap = new Map<number, CourseDetails | null>();

      // Enhanced question sets with course details
      const enhancedQuestionSets = await Promise.all(
        questionSets.map(async (questionSet) => {
          // Check if we already fetched this course's details
          if (!courseDetailsMap.has(questionSet.courseId)) {
            const courseDetails = await this.firebaseService.getCourseDetails(
              questionSet.courseId.toString()
            );
            courseDetailsMap.set(questionSet.courseId, courseDetails);
          }

          // Get course details from map
          const courseDetails = courseDetailsMap.get(questionSet.courseId);

          return {
            ...questionSet,
            course: courseDetails
              ? {
                  id: courseDetails.id,
                  title: courseDetails.title,
                  category: courseDetails.category,
                  rating: courseDetails.rating,
                  progress: courseDetails.progress,
                  colorScheme: courseDetails.colorScheme,
                }
              : null,
          };
        })
      );

      // Group questions by courseId with proper typing
      const groupedQuestions =
        enhancedQuestionSets.reduce<GroupedQuestionsAccumulator>(
          (acc, questionSet) => {
            const courseId = questionSet.courseId.toString(); // Convert to string for object key
            if (!acc[courseId]) {
              acc[courseId] = {
                courseDetails: questionSet.course,
                questions: [],
              };
            }
            acc[courseId].questions.push({
              videoUrl: questionSet.videoUrl,
              questions: questionSet.questions,
              videoData: questionSet.videoData,
              createdAt: questionSet.createdAt,
            });
            return acc;
          },
          {}
        );

      return handleResponse(
        res,
        {
          courses: Object.entries(groupedQuestions).map(([courseId, data]) => ({
            courseId: parseInt(courseId),
            ...data,
          })),
        },
        "Questions retrieved successfully"
      );
    } catch (error) {
      handleError(res, error);
    }
  };
}
