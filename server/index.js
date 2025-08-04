import { createApp, setupErrorHandling } from "./config/app.js";
import { PORT, uploadsDir } from "./config/multer.js";
import routes from "./routes/index.js";

// Create Express application
const app = createApp();

// Setup routes
app.use(routes);

// Setup error handling (should be last)
setupErrorHandling(app);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Anki to Quizlet Converter API running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
});

export default app;
