from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import requests
from fastapi.middleware.cors import CORSMiddleware

# Load a publicly available Hugging Face BERT model for fake news detection
model_name = "Pulk17/Fake-News-Detection"  # You can change this to another public model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Google Fact Check API key
API_KEY = "AIzaSyDlPzaklribp-bExLnXJ8h5PXvTxc26ymY"  # Replace this with your actual key

# Initialize FastAPI app
app = FastAPI()

# ✅ Enable CORS so React frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the structure of the request body
class NewsRequest(BaseModel):
    text: str  #input from user

# Define POST endpoint to check if news is fake or real
@app.post("/check-news")
def check_news(req: NewsRequest):
    try:
        # Step 1: Use Hugging Face model to get AI prediction
        inputs = tokenizer(req.text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            prediction = torch.argmax(logits, dim=1).item()
            confidence = torch.softmax(logits, dim=1).max().item()

        # Map prediction to readable label
        label = "Real" if prediction == 1 else "Fake"

        # Prepare result to return
        result = {
            "ai_result": label,
            "confidence": round(confidence * 100, 2)
        }

        # 2. If confidence is low, query Google Fact Check API
        if confidence < 0.7:
            fact_url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?query={req.text}&key={API_KEY}"
            response = requests.get(fact_url)

            # If the API call is successful
            if response.status_code == 200:
                data = response.json()
                claims = data.get("claims", [])

                # If any claims were found
                if claims:
                    claim = claims[0] # Take the top claim
                    review = claim["claimReview"][0]
                    result["fact_check"] = {
                        "text": claim.get("text", ""),  # Take the claim found
                        "rating": review.get("textualRating", "Unrated"),  #Fact-check rating
                        "claimant": claim.get("claimant", "Unknown"), #Who made the claim
                        "publisher": review.get("publisher", {}).get("name", "Unknown")  # Fact-check source
                      }
                else:
                    result["fact_check"] = "No fact-check found"
            else:
                result["fact_check"] = "Fact check API error"

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

