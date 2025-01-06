import express from "express";
import * as fs from "fs";
import * as path from "path";

const router = express.Router();
const OUTPUT_FILE = path.join(__dirname, "../../data/erc1155_events.json");

// GET /api/erc1155/events
router.get("/events", (req, res) => {
  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      const events = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8") || "[]");
      res.status(200).json(events);
    } else {
      res.status(404).json({ message: "No events found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error });
  }
});

export default router;
