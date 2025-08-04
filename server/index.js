import express from 'express';
import multer from 'multer';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.apkg') {
      cb(null, true);
    } else {
      cb(new Error('Only .apkg files are allowed'));
    }
  }
});

// Utility function to extract and parse .apkg file
async function parseApkgFile(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const zip = new JSZip();
    const contents = await zip.loadAsync(data);
    
    // Extract collection.anki2 (SQLite database)
    const dbFile = contents.files['collection.anki2'];
    if (!dbFile) {
      throw new Error('Invalid .apkg file: collection.anki2 not found');
    }
    
    const dbBuffer = await dbFile.async('nodebuffer');
    const tempDbPath = path.join(uploadsDir, `temp-${Date.now()}.anki2`);
    fs.writeFileSync(tempDbPath, dbBuffer);
    
    // Parse SQLite database with fallback
    let cards;
    try {
      cards = await parseAnkiDatabase(tempDbPath);
      console.log(`Successfully parsed ${cards.length} cards using primary method`);
    } catch (primaryError) {
      console.warn('Primary parsing failed, trying fallback method:', primaryError.message);
      try {
        cards = await parseAnkiDatabaseFallback(tempDbPath);
        console.log(`Successfully parsed ${cards.length} cards using fallback method`);
      } catch (fallbackError) {
        fs.unlinkSync(tempDbPath); // Clean up before throwing
        throw new Error(`Both parsing methods failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
      }
    }
    
    // Clean up temporary file
    fs.unlinkSync(tempDbPath);
    
    return cards;
  } catch (error) {
    throw new Error(`Failed to parse .apkg file: ${error.message}`);
  }
}

// Parse Anki SQLite database
function parseAnkiDatabase(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    const cards = [];
    
    // First, check what tables exist in the database
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
      if (err) {
        db.close();
        reject(err);
        return;
      }
      
      console.log('Available tables:', tables.map(t => t.name));
      
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
        
        rows.forEach(row => {
          try {
            const fields = row.fields.split('\x1f'); // Anki uses \x1f as field separator
            
            if (fields.length >= 2) {
              // Basic term/definition mapping
              const term = cleanHtml(fields[0]);
              const definition = cleanHtml(fields[1]);
              
              if (term && definition) {
                cards.push({
                  id: row.card_id,
                  term: term,
                  definition: definition,
                  tags: row.tags || ''
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
                  tags: row.tags || ''
                });
              }
            }
          } catch (parseError) {
            console.warn('Failed to parse card:', parseError);
          }
        });
        
        db.close();
        resolve(cards);
      });
    });
  });
}

// Alternative parsing function for different Anki database schemas
function parseAnkiDatabaseFallback(dbPath) {
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
          const fields = row.fields.split('\x1f');
          
          if (fields.length >= 2) {
            const term = cleanHtml(fields[0]);
            const definition = cleanHtml(fields[1]);
            
            if (term && definition) {
              cards.push({
                id: row.note_id || index,
                term: term,
                definition: definition,
                tags: row.tags || ''
              });
            }
          } else if (fields.length === 1) {
            const content = cleanHtml(fields[0]);
            if (content) {
              cards.push({
                id: row.note_id || index,
                term: content,
                definition: content,
                tags: row.tags || ''
              });
            }
          }
        } catch (parseError) {
          console.warn('Failed to parse note:', parseError);
        }
      });
      
      db.close();
      resolve(cards);
    });
  });
}

// Clean HTML content and extract text
function cleanHtml(html) {
  if (!html) return '';
  
  // Remove HTML tags but preserve line breaks
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// Convert cards to CSV format
function convertToQuizletCSV(cards) {
  const csvHeaders = 'Term,Definition,Tags\n';
  const csvRows = cards.map(card => {
    const term = `"${card.term.replace(/"/g, '""')}"`;
    const definition = `"${card.definition.replace(/"/g, '""')}"`;
    const tags = `"${card.tags.replace(/"/g, '""')}"`;
    return `${term},${definition},${tags}`;
  }).join('\n');
  
  return csvHeaders + csvRows;
}

// Routes
app.post('/api/upload', upload.single('apkgFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log(`Processing file: ${req.file.originalname}`);
    
    // Parse the .apkg file
    const cards = await parseApkgFile(req.file.path);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      cards: cards,
      count: cards.length,
      filename: req.file.originalname
    });
    
  } catch (error) {
    console.error('Upload processing error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: error.message || 'Failed to process .apkg file'
    });
  }
});

app.post('/api/export-csv', (req, res) => {
  try {
    const { cards, filename } = req.body;
    
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Invalid cards data' });
    }
    
    const csvContent = convertToQuizletCSV(cards);
    const exportFilename = filename ? 
      filename.replace('.apkg', '_quizlet.csv') : 
      'quizlet_export.csv';
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${exportFilename}"`);
    res.send(csvContent);
    
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({
      error: 'Failed to generate CSV file'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 100MB.'
      });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Anki to Quizlet Converter API running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadsDir}`);
});

export default app;
