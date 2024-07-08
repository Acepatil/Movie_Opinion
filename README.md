
# Movie Opinion

Our project introduces a revolutionary movie rating system where the audience's voice truly matters. Users can leave comments on movies, and an advanced model evaluates these comments to determine their sentiment—positive or negative. The collective sentiment from these comments directly influences the movie's overall rating, ensuring that ratings are a true reflection of public opinion. This dynamic approach democratizes movie reviews, making ratings more accurate and representative of the audience's views.


## Screenshots

![App Screenshot](https://github.com/Acepatil/Movie_Opinion/assets/120791252/699f998c-e42f-4b9a-9470-9e98f416a432)

![App Screenshot](https://github.com/Acepatil/Movie_Opinion/assets/120791252/a32b8afc-c0c9-44c8-8e20-7a1a6ab22259)

![App Screenshot](https://github.com/Acepatil/Movie_Opinion/assets/120791252/b24972da-6fe3-4f6a-8fe5-568987489cba)

![App Screenshot](https://github.com/Acepatil/Movie_Opinion/assets/120791252/f85a5460-1578-400c-a445-e85345cc3938)

## Installation

Install my-project 

```bash
  git clone https://github.com/Acepatil/Movie_Opinion.git
  cd Movie_Opinion
```

Make a .env file in frontend
    
```python
  VITE_BASE_SITE=https://api.themoviedb.org/3/discover/movie 
  VITE_MOVIE_INFO=https://api.themoviedb.org/3/movie
  VITE_MOVIE_SEARCH=https://api.themoviedb.org/3/search/movie
  VITE_API_KEY= Your_own_API_KEY
  VITE_BACKEND_SITE=Your_own_Backend_Site 
```

Run the frontend

```
  cd frontend
  npm run dev
```

Make a .env file in backend

```
  DATABASE_URI=Your_Own_Postgres_DataBase
```

Run the backend

```
  cd backend
  python app.py
```

Now your app is functional on your own database and own backend server




## Feedback

If you have any feedback, please reach out to us at https://linktr.ee/sourabh_patil


