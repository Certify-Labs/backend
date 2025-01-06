import { Request, Response } from "express";
import { handleResponse, handleError } from "../utils/responseHandler";
import crypto from "crypto";
import { encryptAndStore } from "../utils/StoreKeyOnInco";

// Encrypt data API
export const encryptDataAPI = async (req: Request, res: Response) => {
  try {
    const { data, courseId, userAddress } = req.body;

    if (!data) {
      return res
        .status(400)
        .json({ success: false, error: "Data is required" });
    }

    // Generate a random 8-byte secret key
    const secretKey = crypto.randomBytes(8);

    // Generate AES key as a BigInt (optional, for specific requirements)
    const aesKeyUint64 = BigInt(`0x${secretKey.toString("hex")}`);

    await encryptAndStore(userAddress, aesKeyUint64, courseId);
    
    // Generate a 16-byte IV
    const iv = crypto.randomBytes(16);

    // Pad the secret key to 16 bytes to use AES-128-CBC
    const keyPadded = Buffer.concat([secretKey, Buffer.alloc(8)]);

    // Create AES cipher
    const cipher = crypto.createCipheriv("aes-128-cbc", keyPadded, iv);

    // Encrypt the data
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");

    // Combine IV and encrypted data in the response
    const responseData = {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
    };

    // Return the response
    handleResponse(res, responseData, "Data encrypted successfully");
  } catch (error) {
    handleError(res, error);
  }
};
