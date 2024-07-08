/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "./MovieList";
import Error from "./Error";
import "./Header.css";
import Loader from "./Loader";

const style = {
  fontSize: "20px",
};

const MovieSearchHeader = ({ movieList, setMovieList }) => {
  let navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;
  const apiURL = import.meta.env.VITE_MOVIE_SEARCH;

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const getMovie = async () => {
    try {
      setLoading(true);
      setMovieList([]);
      const response = await fetch(
        `${apiURL}?query=${query}&api_key=${apiKey}`
      );
      const json = await response.json();
      setMovieList(json.results);
    } catch (e) {
      setError(e.message);
      <Error error={error} />;
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleTitleClick = () => {
    navigate("/movie");
  };
  const handleSearch = () => {
    // Call onSearch callback with the current query state
    navigate("/movie/search");
    setMovieList([]);
    getMovie();
  };

  return (
    <>
      <header>
        <h1 onClick={handleTitleClick}>Movie Search App</h1>
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search for a movie..."
            required
          />
          <button type="submit" onClick={handleSearch}>
            Search
          </button>
        </div>
      </header>
      {loading?<Loader/>:movieList.length ?movieList && (
        <>
        <MovieList movieList={movieList} handleClick={handleClick} />
        </>
      ):
      <>
      <div style={style}>
      <Error error={"No movie found"}/>
      </div>
      </> }
    </>
  );
};

export default MovieSearchHeader;
