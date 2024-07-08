import nltk
from os import getcwd
import numpy as np
import pandas as pd
import pickle
import re                                  # library for regular expression operations
import string                              # for string operations
from nltk.corpus import stopwords          # module for stop words that come with NLTK
from nltk.stem import PorterStemmer        # module for stemming
from nltk.tokenize import TweetTokenizer   # module for tokenizing strings
nltk.download('stopwords')

def process_tweet(tweet):
    # remove old style retweet text "RT"
    tweet2 = re.sub(r'^RT[\s]+', '', tweet)

    # remove hyperlinks
    tweet2 = re.sub(r'https?:\/\/.*[\r\n]*', '', tweet2)
    # remove hashtags
    # only removing the hash # sign from the word
    tweet2 = re.sub(r'#', '', tweet2)
    tokenizer = TweetTokenizer(preserve_case=False, strip_handles=True,
                               reduce_len=True)

    # tokenize tweets
    tweet_tokens = tokenizer.tokenize(tweet2)
    stopwords_english = stopwords.words('english')

    tweets_clean = []

    for word in tweet_tokens: # Go through every word in your tokens list
        if (word not in stopwords_english and  # remove stopwords
            word not in string.punctuation):  # remove punctuation
            tweets_clean.append(word)

    stemmer = PorterStemmer() 
    # Create an empty list to store the stems
    tweets_stem = [] 

    for word in tweets_clean:
        stem_word = stemmer.stem(word)  # stemming word
        tweets_stem.append(stem_word)  # append to the list
    return tweets_stem

def change_review(y):
    for i in range(y.shape[0]):
        if y[i] == 'positive':
            y[i] = 1
        else:
            y[i] = 0

def build_freqs(ys, tweets):
    freqs = {}
    for y, tweet in zip(ys, tweets):
        for word in process_tweet(tweet):
            pair = (word, y)
            if pair in freqs:
                freqs[pair] += 1
            else:
                freqs[pair] = 1
    return freqs


def extract_features(tweet, freqs):
    # process_tweet tokenizes, stems, and removes stopwords
    word_l = process_tweet(tweet)
    # 3 elements in the form of a 1 x 3 vector
    x = np.zeros((1, 3)) 
    #bias term is set to 1
    x[0,0] = 1 
    # loop through each word in the list of words
    for word in word_l:
        # increment the word count for the positive label 1
        x[0,1] += freqs.get((word, 1.0),0)
        # increment the word count for the negative label 0
        x[0,2] += freqs.get((word, 0.0),0)
    assert(x.shape == (1, 3))
    return x

def parameter_X(X,freqs): 
    update = np.zeros((len(X), 3))
    for i in range(len(X)):
        update[i, :]= extract_features(X[i], freqs)
    return update



data=pd.read_csv('server\IMDB_Dataset.csv')
X=data["review"]
y=data["sentiment"]
change_review(y)
print("Value of Y changed")
freqs = build_freqs(y,X)
print("Frequency Built")
update=parameter_X(X,freqs)
print(update)
print("Update Table Built")
# Write dictionary to a pickle file
with open('data.pkl', 'wb') as pickle_file:
    pickle.dump(freqs, pickle_file)



from sklearn.model_selection import train_test_split
# Assuming X and y are your features and labels
X_train, X_test, y_train, y_test = train_test_split(update, y, test_size=0.1, random_state=42)

from sklearn.preprocessing import LabelEncoder

# Assuming y_train is your categorical labels in object dtype
label_encoder = LabelEncoder()
y_train = label_encoder.fit_transform(y_train)
y_test=label_encoder.fit_transform(y_test)

from sklearn.linear_model import LogisticRegression
model=LogisticRegression()
model.fit(X_train,y_train)
print("Model Built")
coefficients = model.coef_
intercept = model.intercept_
print("Coefficients:", coefficients)
print("Intercept:", intercept)


from sklearn.metrics import accuracy_score
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f'Accuracy: {accuracy:.2f}')

pickle.dump(model, open('model.pkl','wb'))
model=pickle.load(open('model.pkl','rb'))


