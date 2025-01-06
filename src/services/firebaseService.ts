import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export interface QuestionSet {
  userAddress: string;
  videoUrl: string;
  questions: any[];
  videoData: any[];
  createdAt: Timestamp;
  courseId: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  rating: number;
  students: number;
  progress: number;
  colorScheme: {
    darker: string;
    lighter: string;
  };
  link: string;
  icon: string;
  purchasedBy: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  description?: string;
  price?: number;
  videos?: string[];
  numberOfStudents?: number;
  ownerAddress?: string;
  ownerEduname?: string;
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

  async getCourseDetails(courseId: string): Promise<Course | null> {
    try {
      const courseRef = doc(this.db, "courses", courseId.toString());
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        console.log(`No course found with ID: ${courseId}`);
        return null;
      }

      return {
        id: courseSnap.id,
        ...courseSnap.data(),
      } as Course;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  }

  async saveCourse(courseId: string, courseData: any): Promise<string> {
    try {
      if (!courseId || typeof courseId !== "string") {
        throw new Error("Invalid courseId: must be a non-empty string");
      }
      const courseDoc = {
        id: courseId,
        name: courseData.name || "",
        title: courseData.name || "",
        description: courseData.description || "",
        metadataURI: courseData.metadataURI || "",
        isPremium: courseData.isPremium || false,
        minPurchaseAmount: courseData.minPurchaseAmount,
        certificatePrice: courseData.certificatePrice,
        basePrice: courseData.basePrice,
        scalingFactor: courseData.scalingFactor,
        price: courseData.basePrice || 0,
        videos: courseData.videoLinks || [],
        category: courseData.category || "",
        rating: 0,
        numberOfStudents: 0,
        purchasedBy: [],
        ownerAddress: courseData.ownerAddress || "",
        ownerEduname: courseData.ownerEduname || "",
        xProfileLink: courseData.xProfileLink || "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        colorScheme: {
          darker: "#000000",
          lighter: "#ffffff",
        },
        students: 0,
        progress: 0,
        link: "",
        icon: "",
      };

      const docRef = doc(this.db, "courses", courseId.toString().trim());
      await setDoc(docRef, courseDoc);
      return courseId;
    } catch (error) {
      console.error("Error saving course:", error);
      throw error;
    }
  }

  // async saveCourse(courseId: string, courseData: any): Promise<string> {
  //   try {
  //     const docRef = doc(this.db, "courses", courseId.toString());
  //     const courseDoc = {
  //       id: courseId,
  //       title: courseData.name,
  //       description: courseData.description,
  //       price: courseData.basePrice,
  //       videos: courseData.videoLinks,
  //       category: courseData.category,
  //       rating: 0,
  //       numberOfStudents: 0,
  //       purchasedBy: [],
  //       ownerAddress: courseData.ownerAddress,
  //       ownerEduname: courseData.ownerEduname,
  //       createdAt: Timestamp.now(),
  //     };

  //     await setDoc(docRef, courseDoc);
  //     return courseId;
  //   } catch (error) {
  //     console.error("Error saving course:", error);
  //     throw error;
  //   }
  // }

  async getCourseById(courseId: string): Promise<Course> {
    try {
      const docRef = doc(this.db, "courses", courseId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Course not found");
      }
      return docSnap.data() as Course;
    } catch (error) {
      console.error("Error getting course:", error);
      throw error;
    }
  }

  async getCoursesByOwner(ownerAddress: string): Promise<Course[]> {
    try {
      const coursesRef = collection(this.db, "courses");
      const q = query(coursesRef, where("ownerAddress", "==", ownerAddress));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as Course);
    } catch (error) {
      console.error("Error getting courses:", error);
      throw error;
    }
  }
}

export default FirebaseService;
