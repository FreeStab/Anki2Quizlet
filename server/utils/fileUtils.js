import fs from "fs";

// Clean up file helper
export function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    }
  } catch (error) {
    console.warn(`Failed to cleanup file ${filePath}:`, error.message);
  }
}

// Ensure directory exists
export function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
