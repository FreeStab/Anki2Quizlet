# GitHub Pages Deployment Guide

## 🚀 Deployment Overview

This Anki to Quizlet Converter can be deployed to GitHub Pages for the frontend, while the backend needs to run locally or on a separate hosting service.

## 📋 Prerequisites

- GitHub account
- Node.js installed locally
- Git installed

## 🔧 Setup Instructions

### 1. Fork/Clone the Repository

```bash
git clone https://github.com/your-username/Anki2Quizlet.git
cd Anki2Quizlet
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy to GitHub Pages

#### Option A: Automatic Deployment (Recommended)

1. Push your code to the `main` branch
2. The GitHub Action will automatically build and deploy to GitHub Pages
3. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`

#### Option B: Manual Deployment

```bash
npm run deploy
```

### 4. Access Your Deployed App

Your app will be available at: `https://your-username.github.io/Anki2Quizlet/`

## 🔄 Using the Deployed App

### For End Users:

1. **Visit the GitHub Pages URL**
2. **Run the backend locally:**
   ```bash
   # Clone the repository
   git clone https://github.com/your-username/Anki2Quizlet.git
   cd Anki2Quizlet
   
   # Install dependencies
   npm install
   
   # Start the backend server
   npm run server
   ```
3. **Keep the backend running** while using the web app
4. **Upload your .apkg files** and convert them to Word documents

### For Developers:

1. **Development with hot reload:**
   ```bash
   npm run dev:full
   ```

2. **Backend only:**
   ```bash
   npm run dev:server
   ```

3. **Frontend only:**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   GitHub Pages  │    │  Local Backend  │
│   (Frontend)    │◄──►│   (Node.js)     │
│                 │    │                 │
│ - Vue.js App    │    │ - File Upload   │
│ - Static Files  │    │ - .apkg Parsing │
│ - PWA Features  │    │ - DOCX Export   │
└─────────────────┘    └─────────────────┘
```

## 🔗 Alternative Backend Hosting

To make the app fully hosted (no local backend required), you can deploy the backend to:

### Vercel Functions
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend as serverless functions
vercel
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
railway login
railway deploy
```

### Render/Heroku
- Create a new web service
- Connect your GitHub repository
- Set build command: `npm install`
- Set start command: `npm run server`

## 🎯 Environment Configuration

The app automatically detects the environment:

- **Development**: Uses `http://localhost:3001` for API calls
- **Production**: Uses `http://localhost:3001` (users run backend locally)

To use a hosted backend, update `src/config/api.js`:

```javascript
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001',
  },
  production: {
    baseURL: 'https://your-backend-service.com', // Your hosted backend
  }
};
```

## 🎨 PWA Features

The app includes Progressive Web App features:
- **Offline capability** (frontend only)
- **Install prompt** on mobile/desktop
- **App-like experience**

## 🚨 Important Notes

1. **CORS**: The backend includes CORS configuration for cross-origin requests
2. **File Size**: Maximum upload size is 100MB
3. **Local Storage**: The app remembers user preferences
4. **Browser Compatibility**: Works on modern browsers that support ES6+ features

## 🔧 Troubleshooting

### "Network Error" when uploading files:
- Ensure the backend is running on `http://localhost:3001`
- Check that no firewall is blocking the connection
- Verify the server logs for error messages

### GitHub Pages deployment fails:
- Check the Actions tab for build errors
- Ensure all dependencies are in `package.json`
- Verify the build command succeeds locally

### App shows "Loading..." indefinitely:
- Check browser console for JavaScript errors
- Ensure all Vue components are properly imported
- Verify API configuration in `src/config/api.js`

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify backend server is running and accessible
3. Test with a small .apkg file first
4. Check GitHub Issues for known problems

---

**Note**: This deployment strategy allows users to experience the full application with minimal setup while maintaining the robust backend functionality locally.
