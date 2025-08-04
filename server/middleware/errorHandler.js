import multer from "multer";

export function errorHandler(error, req, res, next) {
  // Handle Multer errors
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Maximum size is 100MB.",
      });
    }
  }

  console.error("Server error:", error);
  res.status(500).json({
    error: error.message || "Internal server error",
  });
}
