# CodeSentry 🛡️

AI-Powered GitHub Pull Request Code Review Assistant

## Features

- 🤖 AI-powered code analysis using OpenAI GPT-4
- 🔍 Security vulnerability detection
- ⚡ Performance optimization suggestions
- 📋 Best practices recommendations
- 🎨 Modern, responsive UI with real-time feedback
- ⚡ Parallel file processing for faster reviews

## Tech Stack

**Backend:**
- FastAPI
- OpenAI API
- GitHub API
- Python 3.9+

**Frontend:**
- React 18
- Tailwind CSS
- Axios

## Setup Instructions

### Prerequisites

- Python 3.9 or higher
- Node.js 16+ and npm
- GitHub Personal Access Token
- OpenAI API Key

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```bash
cp .env.example .env
```

5. **Add your API keys to `.env`:**
```
GITHUB_TOKEN=ghp_your_github_token_here
OPENAI_API_KEY=sk-your_openai_key_here
```

6. **Run the server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file (optional):**
```bash
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
```

4. **Run development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Getting API Keys

### GitHub Token
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scopes: `repo` (Full control of private repositories)
4. Copy the token

### OpenAI API Key
1. Go to [OpenAI API Platform](https://platform.openai.com)
2. Navigate to API Keys
3. Create new secret key
4. Copy the key

## Usage

1. Open the application in your browser
2. Enter the repository owner (e.g., `facebook`)
3. Enter the repository name (e.g., `react`)
4. Enter the PR number (e.g., `123`)
5. Click "Start Review"
6. Wait for AI analysis (may take 30-60 seconds)
7. Review the results with color-coded severity levels

## API Endpoints

### Review PR
```
GET /api/v1/review/{owner}/{repo}/{pr_number}
```

Returns AI-generated code review for all files in the PR.

### Health Check
```
GET /api/v1/health
```

Returns API health status.

## Project Structure

```
codesentry/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── github.py      # GitHub API integration
│   │   │       ├── review.py      # OpenAI review logic
│   │   │       └── routes.py      # API routes
│   │   ├── __init__.py
│   │   └── main.py                # FastAPI app
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── dashboard.jsx      # Main dashboard
│   │   ├── services/
│   │   │   └── api.js             # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
└── README.md
```

## Features Explained

### Code Quality Analysis
- Identifies code smells
- Suggests refactoring opportunities
- Evaluates code structure

### Security Scanning
- Detects potential vulnerabilities
- Flags security anti-patterns
- Suggests security improvements

### Performance Optimization
- Identifies performance bottlenecks
- Suggests optimization strategies
- Reviews algorithmic complexity

### Best Practices
- Enforces coding standards
- Suggests modern patterns
- Recommends documentation improvements

## Limitations

- Maximum 20 files per PR (to prevent API abuse)
- Requires valid GitHub token with repo access
- OpenAI API usage incurs costs
- Rate limited by GitHub and OpenAI APIs

## Troubleshooting

### Backend Issues

**Error: "GITHUB_TOKEN environment variable is not set"**
- Make sure `.env` file exists in backend directory
- Verify the token is correctly set

**Error: "GitHub API rate limit exceeded"**
- Wait for rate limit reset (usually 1 hour)
- Use authenticated token for higher limits

### Frontend Issues

**API connection errors:**
- Verify backend is running on port 8000
- Check CORS settings in `main.py`
- Verify API URL in frontend `.env`

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.