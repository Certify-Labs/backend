import { ethers } from "ethers";
import { createInstance } from "fhevmjs/node"; // Node.js version of fhevmjs
import dotenv from "dotenv";
import { contractAbi } from "../helpers/KeyManagerAbi";

dotenv.config();

// Constants
const RPC_URL = "https://validator.rivest.inco.org";
const PRIVATE_KEY = process.env.INCO_PRIVATE_KEY || ""; // Wallet private key for sending transactions
const CONTRACT_ADDRESS = "0xc5A988Ac14C1e54b46eE98ceB86074Ae94fcec3B";

const ABI = contractAbi; // Ensure this matches the deployed contract's ABI

// Ethers.js provider and wallet setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

let fhevmInstance: any; // FHEVM instance

/**
 * Get or create the FHEVM instance
 */
export const getFhevmInstance = async (): Promise<any> => {
  try {
    if (!fhevmInstance) {
      fhevmInstance = await createInstance({
        chainId: 21097,
        networkUrl: "https://validator.rivest.inco.org/",
        gatewayUrl: "https://gateway.rivest.inco.org/",
        aclAddress: "0x2Fb4341027eb1d2aD8B5D9708187df8633cAFA92",
      });
      console.log("FHEVM instance created successfully.");
    }
    return fhevmInstance;
  } catch (error) {
    console.error("Error creating FHEVM instance:", error);
    throw new Error("Failed to create FHEVM instance.");
  }
};

/**
 * Encrypt data and store it on the blockchain.
 */
export const encryptAndStore = async (
  userAddress: string,
  aesKeyUint64: bigint, // Ensure aesKeyUint64 is passed as BigInt
  courseId: number
): Promise<{ txHash: string }> => {
  try {
    // Validate user address
    if (!ethers.isAddress(userAddress)) {
      throw new Error("Invalid user address");
    }

    // Get or initialize FHEVM instance
    let instance;
    try {
      instance = await getFhevmInstance();
    } catch (error) {
      console.error("Error getting FHEVM instance:", error);
      throw new Error("Failed to get FHEVM instance.");
    }

    // Create encrypted inputs
    let encryptedInput;
    try {
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, await wallet.getAddress());
      input.add64(aesKeyUint64); // Ensure the key is properly formatted
      encryptedInput = await input.encrypt();
    } catch (error) {
      console.error("Error creating encrypted inputs:", error);
      throw new Error("Failed to create encrypted inputs.");
    }

    // Interact with the smart contract
    let tx;
    try {
      tx = await contract.storeKey(
        userAddress,
        BigInt(courseId),
        "Course N", // Assuming NFT type is always "Course"
        encryptedInput.handles[0], // Encrypted input handle
        encryptedInput.inputProof, // Encrypted input proof
        { gasLimit: 1000000 }
      );
      console.log("Transaction sent:", tx.hash);
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw new Error("Failed to send transaction to store key.");
    }

    // Wait for the transaction to be mined
    try {
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);
    } catch (error) {
      console.error("Error waiting for transaction confirmation:", error);
      throw new Error("Failed to confirm transaction.");
    }

    // Return the transaction hash
    return { txHash: tx.hash };
  } catch (error) {
    console.error("Error encrypting and storing data:", error);
    throw new Error("Failed to encrypt and store data on the blockchain.");
  }
};
