import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { uploadsDir } from "../config/multer.js";
import {
  parseAnkiDatabase,
  parseAnkiDatabaseFallback,
} from "./databaseParser.js";
import { cleanupFile } from "../utils/fileUtils.js";

// Utility function to extract and parse .apkg file
export async function parseApkgFile(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const zip = new JSZip();
    const contents = await zip.loadAsync(data);

    // Extract collection.anki2 (SQLite database)
    const dbFile = contents.files["collection.anki2"];
    if (!dbFile) {
      throw new Error("Invalid .apkg file: collection.anki2 not found");
    }

    const dbBuffer = await dbFile.async("nodebuffer");
    const tempDbPath = path.join(uploadsDir, `temp-${Date.now()}.anki2`);
    fs.writeFileSync(tempDbPath, dbBuffer);

    // Parse SQLite database with fallback
    let cards;
    try {
      cards = await parseAnkiDatabase(tempDbPath);
      console.log(
        `Successfully parsed ${cards.length} cards using primary method`
      );
    } catch (primaryError) {
      console.warn(
        "Primary parsing failed, trying fallback method:",
        primaryError.message
      );
      try {
        cards = await parseAnkiDatabaseFallback(tempDbPath);
        console.log(
          `Successfully parsed ${cards.length} cards using fallback method`
        );
      } catch (fallbackError) {
        cleanupFile(tempDbPath);
        throw new Error(
          `Both parsing methods failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`
        );
      }
    }

    // Clean up temporary file
    cleanupFile(tempDbPath);

    return cards;
  } catch (error) {
    throw new Error(`Failed to parse .apkg file: ${error.message}`);
  }
}
