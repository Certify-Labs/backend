import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { LearnAndEarnPlatformAbi } from "../helpers/LearnAndEarnPlatformAbi";
dotenv.config();
import { tweetCourseCreated } from "../helpers/TweetAboutCourse";

// Constants
const RPC_URL = process.env.RPC_URL || "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const ABI = LearnAndEarnPlatformAbi;
const OUTPUT_FILE = path.join(__dirname, "../../data/LearnAndEarnPlatformData.json");

// Check environment variables
if (!RPC_URL || !CONTRACT_ADDRESS) {
  throw new Error("Please set RPC_URL and CONTRACT_ADDRESS in .env");
}

// Setup provider and contract
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Store last block scanned
let lastBlockScanned = 0;

// Ensure the data directory exists
const ensureDataDirectoryExists = () => {
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

/**
 * Function to handle CourseCreated event.
 */
const handleCourseCreated = (
  courseId: string,
  publisher: string,
  name: string,
  vault: string,
  metadataURI: string,
  isPremium: boolean,
  minPurchaseAmount: string,
  certificatePrice: string
) => {
  console.log("Handling CourseCreated event...");
  // Call the tweet function
  tweetCourseCreated( 
    metadataURI,
  );
};

/**
 * Fetch all events and save to file.
 */
const fetchAllEvents = async () => {
  try {
    const currentBlock = await provider.getBlockNumber();

    if (lastBlockScanned === 0) {
      lastBlockScanned = currentBlock - 1000; // Fetch events from 1000 blocks ago initially
    }

    console.log(`Fetching events from block ${lastBlockScanned + 1} to ${currentBlock}...`);

    const logs = await provider.getLogs({
      address: CONTRACT_ADDRESS,
      fromBlock: lastBlockScanned + 1,
      toBlock: currentBlock,
    });

    console.log(`Found ${logs.length} new logs.`);

    const events = logs.map((log) => {
      try {
        const parsedLog: any = contract.interface.parseLog(log);

        // Check if the event is CourseCreated
        if (parsedLog.name === "CourseCreated") {
          handleCourseCreated(
            parsedLog.args.courseId.toString(),
            parsedLog.args.publisher,
            parsedLog.args.name,
            parsedLog.args.vault,
            parsedLog.args.metadataURI,
            parsedLog.args.isPremium,
            parsedLog.args.minPurchaseAmount.toString(),
            parsedLog.args.certificatePrice.toString()
          );
        }

        return {
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          eventName: parsedLog.name,
          eventSignature: parsedLog.signature,
          args: Object.fromEntries(
            Object.entries(parsedLog.args).map(([key, value]) =>
              typeof value === "bigint" ? [key, value.toString()] : [key, value]
            )
          ),
        };
      } catch (err) {
        console.error("Failed to parse log:", err);
        return null;
      }
    }).filter(Boolean);

    // Ensure data directory exists
    ensureDataDirectoryExists();

    // Read existing data from file
    let existingData: any[] = [];
    if (fs.existsSync(OUTPUT_FILE)) {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8") || "[]");
    }

    // Append new events to existing data
    existingData.push(...events);

    // Write updated data back to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`Events saved to ${OUTPUT_FILE}`);

    // Update the last block scanned
    lastBlockScanned = currentBlock;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

// Start periodic polling
export const startPolling = () => {
  console.log("Starting event polling...");
  setInterval(fetchAllEvents, 10000);
};
