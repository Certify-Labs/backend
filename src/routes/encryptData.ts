import { Router } from "express";
import { encryptDataAPI } from "../controllers/EncryptedDataController";

const router = Router();

// POST endpoint for encrypting data
router.post("/", encryptDataAPI);

export default router;
