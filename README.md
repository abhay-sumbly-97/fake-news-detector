# 🕵️‍♂️ Fake News Detector

A web application to detect whether a news article or headline is real or fake using:
- 🧠 Hugging Face Transformers
- ⚡ FastAPI (Python backend)
- ⚛️ React + TailwindCSS (Frontend)
- ✅ Google Fact Check API for enhanced verification

## 🚀 Features
- Classifies news as **Real** or **Fake** using AI
- Shows prediction confidence
- Cross-checks with Google Fact Check API

## 🛠️ Tech Stack
- Frontend: React, TailwindCSS
- Backend: FastAPI, Hugging Face Transformers
- Deployment: Localhost / GitHub

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/fake-news-detector.git
cd fake-news-detector

# Start backend
cd backend-folder-name
pip install -r requirements.txt
uvicorn main:app --reload

# Start frontend
cd ../fake-news-ui
npm install
npm start