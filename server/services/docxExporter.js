import { Document, Packer, Paragraph, TextRun } from "docx";

// Convert cards to Word document format for Quizlet
export async function convertToQuizletDocx(cards) {
  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Anki to Quizlet Import",
                bold: true,
                size: 32,
              }),
            ],
            spacing: {
              after: 400,
            },
          }),

          // Instructions
          new Paragraph({
            children: [
              new TextRun({
                text: "Instructions: Each term and definition pair is formatted for easy import into Quizlet. Copy and paste the content below into Quizlet's import feature.",
                italics: true,
              }),
            ],
            spacing: {
              after: 600,
            },
          }),

          // Cards content
          ...cards
            .map((card, index) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. `,
                    bold: true,
                  }),
                  new TextRun({
                    text: card.term,
                    bold: true,
                  }),
                ],
                spacing: {
                  before: 200,
                },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: card.definition,
                  }),
                ],
                spacing: {
                  after: 300,
                },
              }),
              // Add tags if they exist
              ...(card.tags
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Tags: ${card.tags}`,
                          italics: true,
                          size: 18,
                        }),
                      ],
                      spacing: {
                        after: 400,
                      },
                    }),
                  ]
                : []),
            ])
            .flat(),

          // Alternative format section
          new Paragraph({
            children: [
              new TextRun({
                text: "Alternative Format (Tab-separated for easy copy-paste):",
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: 800,
              after: 400,
            },
          }),

          // Simple tab-separated format
          ...cards.map(
            (card) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${card.term}\t${card.definition}`,
                  }),
                ],
                spacing: {
                  after: 100,
                },
              })
          ),
        ],
      },
    ],
  });

  // Generate and return the document buffer
  return await Packer.toBuffer(doc);
}
