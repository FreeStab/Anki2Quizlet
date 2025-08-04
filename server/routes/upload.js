import { Router } from "express";
import fs from "fs";
import { upload } from "../config/multer.js";
import { parseApkgFile } from "../services/apkgParser.js";
import { cleanupFile } from "../utils/fileUtils.js";

const router = Router();

router.post("/upload", upload.single("apkgFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Processing file: ${req.file.originalname}`);

    // Parse the .apkg file
    const cards = await parseApkgFile(req.file.path);

    // Clean up uploaded file
    cleanupFile(req.file.path);

    res.json({
      success: true,
      cards: cards,
      count: cards.length,
      filename: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload processing error:", error);

    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      cleanupFile(req.file.path);
    }

    res.status(500).json({
      error: error.message || "Failed to process .apkg file",
    });
  }
});

export default router;
