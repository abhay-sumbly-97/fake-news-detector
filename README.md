# 🕵️‍♂️ Fake News Detector

A web application to detect whether a news article or headline is real or fake using:
- Hugging Face Transformers
- FastAPI (Python backend)
- React + TailwindCSS (Frontend)
- Google Fact Check API for enhanced verification

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
```

## 📸 Demo
Here’s how it works:

- Paste or type in a news article or headline.
- Click Check News
- See if it’s 🟢 Real or 🔴 Fake (with optional fact-checking).\

## 📝 Future Enhancements
- Save and display prediction history

- Support other languages and news sources

- Admin dashboard to monitor usage

- User authentication and rate limiting

## 🙌 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
