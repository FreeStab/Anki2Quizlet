# Copilot Instructions for Anki to Quizlet Converter

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is an Anki to Quizlet Converter application built as a Progressive Web App (PWA) using Vue.js frontend and Node.js backend.

## Key Technologies

- **Frontend**: Vue.js 3 with Vite
- **Backend**: Node.js with Express
- **File Processing**: .apkg (SQLite database) parsing
- **Export Format**: CSV compatible with Quizlet
- **PWA**: Service Worker, Web App Manifest

## Core Functionality

- Parse .apkg files (Anki package format containing SQLite databases)
- Extract card data (front/back, media references)
- Convert to Quizlet-compatible CSV format
- Drag & drop file upload interface
- Progress tracking for large files
- Preview functionality before export

## Code Style Guidelines

- Use Vue 3 Composition API
- TypeScript for type safety where possible
- Modular component structure
- Responsive design with CSS Grid/Flexbox
- Error handling with user-friendly messages
- File size validation (max 100MB)

## File Structure Patterns

- `/src/components/` - Vue components
- `/src/composables/` - Vue composables for logic
- `/src/utils/` - Utility functions for file processing
- `/server/` - Node.js backend API
- `/public/` - Static assets and PWA manifest

## Important Considerations

- Handle HTML content in Anki cards properly
- Support UTF-8 encoding for international characters
- Implement proper error boundaries
- Optimize for large file processing
- Maintain responsive UI during processing
- Follow accessibility guidelines

## Testing Approach

- Unit tests for conversion logic
- Integration tests for file processing
- E2E tests for user workflows
- Test with real .apkg files of various sizes
