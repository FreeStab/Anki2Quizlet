import { Router } from "express";
import uploadRoutes from "./upload.js";
import exportRoutes from "./export.js";
import healthRoutes from "./health.js";

const router = Router();

// Mount route modules
router.use("/api", uploadRoutes);
router.use("/api", exportRoutes);
router.use("/api", healthRoutes);

export default router;
