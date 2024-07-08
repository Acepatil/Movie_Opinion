// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Movie from "./Movie";
import MovieInfo from "./MovieInfo";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState.jsx";
import "./App.css";


function App() {
  const [userName, setUserName] = useLocalStorageState("", "username");

  const [movieList, setMovieList] = useState([]);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Login username={userName} setUsername={setUserName} />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Register username={userName} setUsername={setUserName} />
              </>
            }
          />

          <Route
            path="/movie"
            element={
              <>
                {userName ? (
                  <>
                    <Header movieList={movieList} setMovieList={setMovieList} />
                    <Movie
                      movieList={movieList}
                      setMovieList={setMovieList}
                    />
                  </>
                ) : (
                  <>
                    <h1>Login First</h1>
                  </>
                )}
              </>
            }
          />
          <Route
            path="/movie/search"
            element={
              <>
                {userName ? (
                  <>
                    <Header movieList={movieList} setMovieList={setMovieList} />
                  </>
                ) : (
                  <>
                    <h1>Login First</h1>
                  </>
                )}
              </>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <>
                {userName ? (
                  <MovieInfo userName={userName} />
                ) : (
                  <h1>Login First</h1>
                )}
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
