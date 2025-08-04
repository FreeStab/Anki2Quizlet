import { Router } from "express";
import { convertToQuizletDocx } from "../services/docxExporter.js";

const router = Router();

router.post("/export-docx", async (req, res) => {
  try {
    const { cards, filename } = req.body;

    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: "Invalid cards data" });
    }

    console.log(`Generating Word document for ${cards.length} cards`);

    const docxBuffer = await convertToQuizletDocx(cards);
    const exportFilename = filename
      ? filename.replace(".apkg", "_quizlet.docx")
      : "quizlet_export.docx";

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${exportFilename}"`
    );
    res.send(docxBuffer);
  } catch (error) {
    console.error("DOCX export error:", error);
    res.status(500).json({
      error: "Failed to generate Word document",
    });
  }
});

export default router;
