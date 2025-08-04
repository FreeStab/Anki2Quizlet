# Anki to Quizlet Converter

A Progressive Web App (PWA) that converts Anki deck files (.apkg) to Quizlet-compatible Word document format.

## 🌐 Live Demo

**Frontend**: [https://FreeStab.github.io/Anki2Quizlet/](https://FreeStab.github.io/Anki2Quizlet/)

> **Note**: To use the live demo, you'll need to run the backend locally. See [Quick Start for Users](#quick-start-for-users) below.

## Features

- 📁 **Drag & Drop Interface** - Easy file upload with visual feedback
- 🔄 **Real-time Processing** - Convert .apkg files to Quizlet format
- 👀 **Preview Cards** - Review converted cards before export
- 📊 **Conversion Statistics** - Track processing results
- � **Word Document Export** - Download Quizlet-compatible .docx files
- 📱 **PWA Support** - Works offline and can be installed
- 🎯 **File Validation** - Supports .apkg files up to 100MB
- 🔍 **Search & Filter** - Find specific cards in your deck
- 📈 **Responsive Design** - Works on desktop and mobile
- 🚀 **GitHub Pages Ready** - Frontend can be deployed to GitHub Pages

## 🚀 Quick Start for Users

If you just want to use the app:

1. **Visit the live demo** (link above)
2. **Run the backend locally:**
   ```bash
   git clone https://github.com/FreeStab/Anki2Quizlet.git
   cd Anki2Quizlet
   npm install
   npm run server
   ```
3. **Upload your .apkg files** and convert them!

## 🛠️ Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Anki2Quizlet
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev:full
```

This will start both the frontend (Vite) and backend (Express) servers concurrently.

### Available Scripts

- `npm run dev` - Start frontend development server only
- `npm run dev:server` - Start backend server with hot reload
- `npm run dev:full` - Start both frontend and backend servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start production backend server
- `npm run start` - Build and start production servers
- `npm run deploy` - Deploy frontend to GitHub Pages

## 🚀 Deployment

### GitHub Pages (Frontend Only)

The frontend can be deployed to GitHub Pages while users run the backend locally:

1. **Automatic deployment** (recommended):

   - Push to `main` branch
   - GitHub Actions will automatically build and deploy

2. **Manual deployment**:
   ```bash
   npm run deploy
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Full-Stack Deployment

To deploy both frontend and backend:

- **Frontend**: GitHub Pages, Netlify, or Vercel
- **Backend**: Railway, Render, Heroku, or Vercel Functions

## How to Use

1. **Upload Your Anki Deck**

   - Drag and drop your .apkg file onto the upload area
   - Or click "Browse Files" to select a file
   - Supported file size: up to 100MB

2. **Review Conversion Results**

   - View conversion statistics
   - Preview converted cards
   - Use search to find specific cards

3. **Export to Quizlet**
   - Click "Export to CSV" to download
   - Follow the import instructions for Quizlet

## Importing to Quizlet

1. Go to [Quizlet.com](https://quizlet.com) and log in
2. Click "Create" → "Study set"
3. Click "Import from Word, Excel, Google Docs, etc."
4. Upload your downloaded CSV file
5. Review and publish your study set

## Technical Stack

### Frontend

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and development server
- **VueUse** - Collection of Vue composition utilities
- **Axios** - HTTP client for API requests
- **Vite PWA Plugin** - Progressive Web App functionality

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **SQLite3** - Database for parsing .apkg files
- **JSZip** - ZIP file processing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## Project Structure

```
├── public/                 # Static assets
│   ├── pwa-192x192.svg    # PWA icon (192x192)
│   ├── pwa-512x512.svg    # PWA icon (512x512)
│   └── vite.svg           # Vite logo
├── server/                # Backend server
│   └── index.js          # Express server and API routes
├── src/                  # Frontend source code
│   ├── components/       # Vue components
│   │   ├── CardPreview.vue      # Card preview and export
│   │   ├── ConversionStats.vue  # Statistics display
│   │   └── FileUpload.vue       # File upload interface
│   ├── App.vue          # Main application component
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── .github/
│   └── copilot-instructions.md  # Copilot configuration
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Development

### Code Style

- Use Vue 3 Composition API
- Follow component naming conventions
- Add proper error handling and user feedback
- Maintain responsive design principles

### Testing

- Test with various .apkg file formats
- Verify CSV output compatibility with Quizlet
- Test file size limits and error handling
- Validate PWA functionality

## Troubleshooting

### Common Issues

1. **Large File Processing**

   - Files over 100MB are not supported
   - Complex card formats may take longer to process

2. **Conversion Errors**

   - Ensure .apkg file is not corrupted
   - Some custom Anki templates may not convert perfectly

3. **Import Issues**
   - Verify CSV format is compatible with Quizlet
   - Check for special characters in card content

---

Made with ❤️ for language learners
