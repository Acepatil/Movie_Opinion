/* eslint-disable react/prop-types */
function MovieList({movieList,handleClick}) {
    return (
        <div className="movie-container">
      {movieList.map((movie) => (
        <div
          className="movie-item"
          key={movie.id}
          onClick={() => handleClick(movie.id)}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster of `}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <div>
              <h6>{movie.title}</h6>
            </div>
          </div>
        </div>
      ))}
    </div>
    )
}

export default MovieList
