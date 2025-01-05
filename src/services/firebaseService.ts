import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

export interface QuestionSet {
  userAddress: string;
  videoUrl: string;
  questions: any[];
  videoData: any[];
  createdAt: Timestamp;
  courseId: number;
}

export class FirebaseService {
  private db;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyChsGm7FUjMuX3lHCpNoTq_wrqBNfIe_z4",
      authDomain: "certify-labs.firebaseapp.com",
      projectId: "certify-labs",
      storageBucket: "certify-labs.firebasestorage.app",
      messagingSenderId: "724024504724",
      appId: "1:724024504724:web:35288a698757feb1331f81",
    };

    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  async saveQuestions(
    userAddress: string,
    videoUrl: string,
    questions: any[],
    videoData: any[],
    courseId: number
  ): Promise<string> {
    try {
      const questionSet: QuestionSet = {
        userAddress,
        videoUrl,
        questions,
        videoData,
        createdAt: Timestamp.now(),
        courseId,
      };

      const docRef = await addDoc(
        collection(this.db, "questionSets"),
        questionSet
      );
      return docRef.id;
    } catch (error) {
      console.error("Error saving questions to Firebase:", error);
      throw error;
    }
  }

  async getQuestionsByUserAddress(userAddress: string): Promise<QuestionSet[]> {
    try {
      const q = query(
        collection(this.db, "questionSets"),
        where("userAddress", "==", userAddress)
      );

      const querySnapshot = await getDocs(q);
      const questionSets: QuestionSet[] = [];

      querySnapshot.forEach((doc) => {
        questionSets.push(doc.data() as QuestionSet);
      });

      return questionSets;
    } catch (error) {
      console.error("Error fetching questions from Firebase:", error);
      throw error;
    }
  }
}
