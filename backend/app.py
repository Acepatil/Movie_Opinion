import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import numpy as np
import pickle
import re
import string
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import TweetTokenizer
from dotenv import load_dotenv
import bcrypt

import nltk
nltk.download('stopwords')

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)

# Load the frequency dictionary and model
with open('data.pkl', 'rb') as pickle_file:
    freqs = pickle.load(pickle_file)

model = pickle.load(open('model.pkl', 'rb'))

# Define database models
class User(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False,primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    prediction = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(100), db.ForeignKey('user.username'), nullable=False)
    user = db.relationship('User', backref=db.backref('comments', lazy=True))

# Functions for sentiment analysis
def process_tweet(tweet):
    tweet = re.sub(r'^RT[\s]+', '', tweet)
    tweet = re.sub(r'https?:\/\/.*[\r\n]*', '', tweet)
    tweet = re.sub(r'#', '', tweet)
    tokenizer = TweetTokenizer(preserve_case=False, strip_handles=True, reduce_len=True)
    tweet_tokens = tokenizer.tokenize(tweet)
    stopwords_english = stopwords.words('english')
    tweets_clean = [word for word in tweet_tokens if word not in stopwords_english and word not in string.punctuation]
    stemmer = PorterStemmer()
    tweets_stem = [stemmer.stem(word) for word in tweets_clean]
    return tweets_stem

def extract_features(tweet, freqs):
    word_l = process_tweet(tweet)
    x = np.zeros((1, 3))
    x[0, 0] = 1
    for word in word_l:
        if word == 'movi':
            continue
        x[0, 1] += freqs.get((word, 1.0), 0)
        x[0, 2] += freqs.get((word, 0.0), 0)
    return x

@app.cli.command("init-db")
def init_db():
    db.create_all()
    print("Database initialized.")

# API Routes
@app.route("/")
def index():
    return "Welcome to the sentiment analysis API!"

@app.route("/delete_all",methods=["POST"])
def delete_all_tables():
    db.drop_all()
    return jsonify({"messge":"Table All deleted"})

@app.route("/create_all",methods=["POST"])
def create_all_tables():
    db.create_all()
    return jsonify({"messge":"Table All Created"})

@app.route("/register",methods=["POST"])
def add_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password=data.get("password")

    if User.query.filter_by(username=username).first() is not None:
        return jsonify(message='Username already exists',same="username"), 400

    if User.query.filter_by(email=email).first() is not None:
        return jsonify(message='Email already exists',same="email"), 400
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    new_user=User(username=username,email=email,password=hashed_password.decode('utf-8'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message":"Added User"})

@app.route("/submit", methods=["POST"])
def make_answer():
    data = request.get_json()
    tweet = data.get("comment", "")
    username = data.get("username")
    movie_id = data.get("movie_id")

    if not tweet or not username or not movie_id:
        print(username)
        print(tweet)
        print(movie_id)
        return jsonify({"error": "Comment, user_id, and movie_id are required"}), 400

    # Process the tweet for sentiment analysis
    update = extract_features(tweet, freqs)
    prediction = model.predict(update)

    # Store the comment in the database
    new_comment = Comment(movie_id=movie_id, content=tweet, prediction=int(prediction[0]), username=username)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        "prediction": int(prediction[0]),  # Convert numpy.int64 to native Python int
        "comment_id": new_comment.id,
        "movie_id": movie_id,
        "username": new_comment.username,
        "content": new_comment.content,
    })

@app.route("/comments", methods=["GET"])
def get_comments():
    movie_id = request.args.get("movie_id")
    if not movie_id:
        return jsonify({"error": "movie_id is required"}), 400

    comments = Comment.query.filter_by(movie_id=movie_id).all()

    comments_list = [
        {
            "id": comment.id,
            "movie_id": comment.movie_id,
            "username": comment.username,
            "content": comment.content,
            "prediction": comment.prediction,
        }
        
        for comment in comments
    ]
    return jsonify({"comments": comments_list})

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    users_list = [{ "username": user.username, "email": user.email,"password":user.password} for user in users]
    return jsonify(users_list)


@app.route("/comment", methods=["GET"])
def get_all_comments():
    comments = Comment.query.all()
    comments_list = [{
        "id": comment.id,
        "movie_id": comment.movie_id,
        "username": comment.username,
        "content": comment.content,
        "prediction": comment.prediction,
    } for comment in comments]
    return jsonify(comments_list)

@app.route("/comments/counts", methods=["GET"])
def get_comment_counts():
    movie_id = request.args.get("movie_id")
    if not movie_id:
        return jsonify({"error": "movie_id is required"}), 400

    positive_count = Comment.query.filter_by(movie_id=movie_id, prediction=1).count()
    negative_count = Comment.query.filter_by(movie_id=movie_id, prediction=0).count()

    return jsonify({
        "positive_count": positive_count,
        "negative_count": negative_count
    })

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify(message='Username or password is missing'), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify(message='Not a user',invalid="username"), 401

    hashed_password = user.password

    if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
        return jsonify(message='Login successful!'), 200
    else:
        return jsonify(message='Invalid username or password',invalid="password"), 401




if __name__ == "__main__":
    app.run(debug=True, port=8080)
