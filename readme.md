# CodeSentry

> AI-powered GitHub PR code review assistant built with FastAPI, React, and Google Gemini.


[🚀 Live Demo](https://your-app.vercel.app) • [📹 Video Demo]

---

## 📹 Demo Video

https://www.loom.com/share/878c5becc04d4123b41886d806d7191d?sid=de203737-98c7-49f3-8a1e-24076eff7be4

--

## ✨ Features

- 🤖 **AI Code Analysis** - Powered by Google Gemini 2.0 Flash
- 🔒 **Security Scanning** - Detect vulnerabilities and anti-patterns
- ⚡ **Performance Insights** - Optimization suggestions with reasoning
- ✅ **Best Practices** - Modern coding standards enforcement
- 📋 **Export Reviews** - Download as markdown with one click
- 💾 **Copy Individual Reviews** - Quick markdown copy per file
- 🎨 **Modern UI** - Vercel-inspired design with Tailwind CSS
- 🚀 **Fast Processing** - Parallel file analysis

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- GitHub Token ([Get one here](https://github.com/settings/tokens))
- Gemini API Key ([Get free key](https://aistudio.google.com/apikey))

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/codesentry.git
cd codesentry
```


1. **Enter PR Details**
   - Repository Owner (e.g., `vercel`)
   - Repository Name (e.g., `next.js`)
   - PR Number (e.g., `12345`)

2. **Analyze** - Click "Analyze PR" button

3. **Review Results**
   - View code quality assessment
   - Check security issues
   - See performance suggestions
   - Review best practices

4. **Export** - Download or copy reviews as markdown

---

## 🌐 Deployment

### Backend (Render - Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create **New Web Service**
4. Connect your repository
5. Configure:
   ```
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Add environment variables:
   - `GITHUB_TOKEN`
   - `GEMINI_API_KEY`
7. Deploy!

### Frontend (Vercel - Free)

```bash
cd frontend
npm install -g vercel
vercel
```

Or use Vercel's GitHub integration for automatic deployments.

**Update Frontend .env:**
```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

---

## 🛠️ Tech Stack

**Backend**
- FastAPI - Modern Python web framework
- Google Gemini 2.0 - AI code analysis
- GitHub REST API - PR data fetching
- Python 3.11

**Frontend**
- React 18 - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client

**DevOps**
- Docker ready
- GitHub Actions compatible
- Environment-based config

---

## 📁 Project Structure

```
codesentry/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── github.py      # GitHub API integration
│   │   │   ├── review_gemini.py # AI review logic
│   │   │   └── routes.py      # API endpoints
│   │   └── main.py            # FastAPI app
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── dashboard.jsx  # Main UI
│   │   ├── services/
│   │   │   └── api.js         # API client
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🎯 Roadmap

- [ ] User authentication (GitHub OAuth)
- [ ] Review history dashboard
- [ ] Database integration
- [ ] Webhook support (auto-review on PR open)
- [ ] Custom review rules
- [ ] Team collaboration features
- [ ] GitHub App integration

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Google Gemini](https://ai.google.dev/) - AI model for code analysis
- [Vercel](https://vercel.com/) - UI inspiration and hosting
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📬 Contact

**Muyiwa Obaremi**
- GitHub: [@yourusername](https://github.com/muyi29)
- Email: obaremimuyiwa@gmail.com

---

<div align="center">
  Made with ❤️ by Muyiwa Obaremi
  
  ⭐ Star this repo if you find it helpful!
</div>