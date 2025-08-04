import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { errorHandler } from "../middleware/errorHandler.js";

export function createApp() {
  const app = express();

  // Security and performance middleware
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(morgan("combined"));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
}

export function setupErrorHandling(app) {
  // Error handling middleware (should be last)
  app.use(errorHandler);
}
