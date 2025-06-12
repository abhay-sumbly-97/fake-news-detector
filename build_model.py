import pandas as pd
import joblib
import re
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

#Load datasets
fake_df = pd.read_csv("Fake.csv")
real_df = pd.read_csv("True.csv")

# Optional: check the counts
print("Fake news count:", len(fake_df))
print("Real news count:", len(real_df))

# Downsample to balance the dataset
min_len = min(len(fake_df), len(real_df))
fake_df = fake_df.sample(n=min_len, random_state=42)
real_df = real_df.sample(n=min_len, random_state=42)

#Add labels
fake_df["label"] = 0 #fake = 0
real_df["label"] = 1 #real = 1

# Combine both datasets
df = pd.concat([fake_df, real_df])
df = df.sample(frac=1).reset_index(drop=True)  # Shuffle

# Keep only necessary columns
df = df[["title", "text", "label"]]

# Combine title and text into a single feature
df["content"] = df["title"] + " " + df["text"]

def clean_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df["content"] = df["content"].apply(clean_text)

print("Dataset loaded successfully!")
print(df.head())

# Features (text) and labels (0 or 1)
X = df["content"]
y = df["label"]

# Convert text to numerical vectors using TF-IDF
vectorizer = TfidfVectorizer(stop_words="english", max_df=0.7)
X_vect = vectorizer.fit_transform(X)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_vect, y, test_size=0.2, random_state=42)

print("Data vectorized and split successfully!")

# Train the model
model = LogisticRegression(max_iter=1000, class_weight = 'balanced')
model.fit(X_train, y_train)

# Predict on test set
y_pred = model.predict(X_test)

# Evaluate the model
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the trained model
joblib.dump(model, "fake_news_model.pkl")

# Save the TF-IDF vectorizer
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")

print("Model and vectorizer saved successfully!")


