# CodeSentry

AI-powered GitHub PR code review assistant built with FastAPI, React, and Google Gemini.

## Quick Start

### 1. Get API Keys

- **GitHub Token:** [github.com/settings/tokens](https://github.com/settings/tokens) - Select `repo` scope
- **Gemini API Key:** [aistudio.google.com/apikey](https://aistudio.google.com/apikey) - Free tier available

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "GITHUB_TOKEN=your_token_here" > .env
echo "GEMINI_API_KEY=your_key_here" >> .env

# Start server
python -m uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features

- 🤖 AI code analysis (Google Gemini)
- 🔒 Security vulnerability detection
- ⚡ Performance optimization suggestions
- ✅ Best practices recommendations
- 🎨 Modern Vercel-inspired UI
- 🚀 Parallel file processing

## Usage

1. Enter repository owner (e.g., `vercel`)
2. Enter repository name (e.g., `next.js`)
3. Enter PR number
4. Click "Analyze PR"
5. Review AI-generated insights

## Deployment

### Backend Options

**Render (Free):**
```bash
# Add to render.yaml
services:
  - type: web
    name: codesentry-api
    runtime: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

**Railway:**
```bash
railway login
railway init
railway up
```

**Fly.io:**
```bash
fly launch
fly deploy
```

### Frontend Options

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Drag & drop dist/ folder to netlify.app
```

## Environment Variables

**Backend (.env):**
```env
GITHUB_TOKEN=ghp_xxx
GEMINI_API_KEY=AIxxx
MOCK_MODE=false  # Set to true for testing without API
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend.com/api/v1
```

## Tech Stack

- **Backend:** FastAPI, Google Gemini API, GitHub API
- **Frontend:** React 18, Tailwind CSS, Vite
- **AI:** Google Gemini 2.0 Flash (free tier)

## License

MIT