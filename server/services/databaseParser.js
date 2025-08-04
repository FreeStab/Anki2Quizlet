import sqlite3 from "sqlite3";
import { cleanHtml } from "../utils/htmlCleaner.js";

// Parse Anki SQLite database
export function parseAnkiDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    const cards = [];

    // First, check what tables exist in the database
    db.all(
      "SELECT name FROM sqlite_master WHERE type='table'",
      [],
      (err, tables) => {
        if (err) {
          db.close();
          reject(err);
          return;
        }

        console.log(
          "Available tables:",
          tables.map((t) => t.name)
        );

        // Use a simpler query that doesn't rely on notetypes table
        // This should work with both older and newer Anki versions
        const query = `
        SELECT 
          n.flds as fields,
          n.tags,
          c.id as card_id
        FROM cards c
        JOIN notes n ON c.nid = n.id
        WHERE c.queue != -1
      `;

        db.all(query, [], (err, rows) => {
          if (err) {
            db.close();
            reject(err);
            return;
          }

          rows.forEach((row) => {
            try {
              const fields = row.fields.split("\x1f"); // Anki uses \x1f as field separator

              if (fields.length >= 2) {
                // Basic term/definition mapping
                const term = cleanHtml(fields[0]);
                const definition = cleanHtml(fields[1]);

                if (term && definition) {
                  cards.push({
                    id: row.card_id,
                    term: term,
                    definition: definition,
                    tags: row.tags || "",
                  });
                }
              } else if (fields.length === 1) {
                // Handle single field cards (use same content for both term and definition)
                const content = cleanHtml(fields[0]);
                if (content) {
                  cards.push({
                    id: row.card_id,
                    term: content,
                    definition: content,
                    tags: row.tags || "",
                  });
                }
              }
            } catch (parseError) {
              console.warn("Failed to parse card:", parseError);
            }
          });

          db.close();
          resolve(cards);
        });
      }
    );
  });
}

// Alternative parsing function for different Anki database schemas
export function parseAnkiDatabaseFallback(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    const cards = [];

    // Try simpler approach - just get notes directly
    const fallbackQuery = `
      SELECT 
        flds as fields,
        tags,
        id as note_id
      FROM notes
      LIMIT 1000
    `;

    db.all(fallbackQuery, [], (err, rows) => {
      if (err) {
        db.close();
        reject(err);
        return;
      }

      console.log(`Found ${rows.length} notes using fallback method`);

      rows.forEach((row, index) => {
        try {
          const fields = row.fields.split("\x1f");

          if (fields.length >= 2) {
            const term = cleanHtml(fields[0]);
            const definition = cleanHtml(fields[1]);

            if (term && definition) {
              cards.push({
                id: row.note_id || index,
                term: term,
                definition: definition,
                tags: row.tags || "",
              });
            }
          } else if (fields.length === 1) {
            const content = cleanHtml(fields[0]);
            if (content) {
              cards.push({
                id: row.note_id || index,
                term: content,
                definition: content,
                tags: row.tags || "",
              });
            }
          }
        } catch (parseError) {
          console.warn("Failed to parse note:", parseError);
        }
      });

      db.close();
      resolve(cards);
    });
  });
}
