import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random
import datetime
import openai

# Initialize Firebase Admin SDK
firebase_config = {
  "apiKey": "AIzaSyBYhFdp_CTuw7MyWptkNXu4G7PyyKB-pjk",
  "authDomain": "herald-9c3c1.firebaseapp.com",
  "projectId": "herald-9c3c1",
  "storageBucket": "herald-9c3c1.appspot.com",
  "messagingSenderId": "1057295222413",
  "appId": "1:1057295222413:web:f16851f59d8c3c3c6644c4",
  "measurementId": "G-CHE5MMCEJL"
}

firebase_admin.initialize_app(options=firebase_config)

# Get a reference to the Firestore database
db = firestore.client()

# Initialize OpenAI API
openai.api_key = 'your-openai-api-key'  # Replace with your actual OpenAI API key

def generate_whimsical_title():
    """Generate a whimsical article title using OpenAI."""
    prompt = "Generate a whimsical and funny article title."
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=50,
        n=1,
        temperature=0.7,
    )
    return response.choices[0].message.content

def generate_article_text(title):
    """Generate article text that takes about 5 minutes to read using OpenAI."""
    prompt = f"Write a whimsical and entertaining article with the title '{title}' that takes about 5 minutes to read."
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
        n=1,
        temperature=0.7,
    )
    return response.choices[0].message.content

def generate_comment(title, article_snippet):
    """Generate a silly comment arguing about the article using OpenAI."""
    prompt = f"Generate a silly and humorous comment arguing about an article titled '{title}'. Here's a snippet of the article: '{article_snippet}'"
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
        n=1,
        temperature=0.9,
    )
    return response.choices[0].message.content.strip()

def add_synthetic_data(num_articles=20, comments_per_article=30):
    """Add synthetic articles and comments to Firestore."""
    posts_ref = db.collection('posts')

    for _ in range(num_articles):
        # Create a new article
        new_article = {
            'title': generate_whimsical_title(),
            'content': generate_article_text(),
            'timestamp': firestore.SERVER_TIMESTAMP,
            'comments': []
        }

        # Add the article
        article_ref = posts_ref.add(new_article)[1]

        # Add comments to the article
        for _ in range(comments_per_article):
            new_comment = {
                'content': generate_comment(),
                'timestamp': firestore.SERVER_TIMESTAMP
            }
            article_ref.update({
                'comments': firestore.ArrayUnion([new_comment])
            })

    print(f"Added {num_articles} whimsical articles with {comments_per_article} comments each to Firestore.")

if __name__ == "__main__":
    add_synthetic_data()
