/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Error from "./Error";
import './Movie.css'


const apiKey = import.meta.env.VITE_API_KEY;
const apiURL = import.meta.env.VITE_BASE_SITE;


function Movie({setMovieList}) {
  // const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await fetch(
          `${apiURL}?api_key=${apiKey}`
        );
        const json = await response.json();
        setMovieList(json.results);
      } catch (e) {
        setError(e.message);
        <Error error={error}/>
      }
      finally{
          setLoading(false);
      }
    };
    getMovie();
  }, [error, setMovieList]);

  if (loading) {
    return <div><Loader/></div>;
  }

  if (error) {
    return <Error error={error}/>
  }
  return (
    <>
    </>
    // <MovieList movieList={movieList} handleClick={handleClick}/>
  );
}

export default Movie;
