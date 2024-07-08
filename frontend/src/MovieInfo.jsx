/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieInfo.css'; // Import the CSS file
import PostComment from './PostComment';
import Loader from './Loader';
import Error from './Error';

const apiKey = import.meta.env.VITE_API_KEY;
const apiURL = import.meta.env.VITE_MOVIE_INFO;
const backURL = import.meta.env.VITE_BACKEND_SITE;

function MovieInfo({userName}) {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [positiveCount, setPositiveCount] = useState(0);
    const [negativeCount, setNegativeCount] = useState(0);

    const getCommentCounts = async () => {
        try {
            const response = await fetch(`${backURL}/comments/counts?movie_id=${id}`);
            const result = await response.json();
            setPositiveCount(result.positive_count);
            setNegativeCount(result.negative_count);
        } catch (error) {
            setError(error.message);
        }
    };

    const getComments = async () => {
        try {
            const response = await fetch(`${backURL}/comments?movie_id=${id}`);
            const result = await response.json();
            setComments(result.comments);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const getMovieInfo = async () => {
            try {
                const response = await fetch(`${apiURL}/${id}?api_key=${apiKey}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setMovie(json);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getMovieInfo();
        getComments();
        getCommentCounts();
        setLoading(()=>false);
    }, [id]);

    const handleCommentPosted = () => {
        // Fetch comments and counts again after a new comment is posted
        getComments();
        getCommentCounts();
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Error error={error} />;
    }

    if (!movie) {
        return <div>No movie information available.</div>;
    }

    const rating = positiveCount === 0 && negativeCount === 0 ? "No rating available😭😭😭" :` ${Math.round((positiveCount / (positiveCount + negativeCount)) * 100)}🍿🍿`;

    return (
        <div className='movie-info-container'>
            <div className='movie-info-item'>
                <div className='movie-poster'>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster of ${movie.title}`} />
                    <h4>{movie.title}</h4>
                </div>
                <div className='movie-details'>
                    
                    <span className='movieSummary'>
                        <h4>Summary:</h4>
                        <p>{movie.overview}</p>
                    </span>
                    <span className='movieSummary'>
                        <h4>Release Date:</h4>
                        <p>{movie.release_date}</p>
                    </span>
                    
                    <span className='movieSummary'>
                        <h4>Positive Comments:</h4>
                        <p>{positiveCount}</p>
                    </span>

                    <span className='movieSummary'>
                        <h4>Negative Comments:</h4>
                        <p>{negativeCount}</p>
                    </span>
                    
                    <span className='movieSummary'>
                        <h4>Rating:</h4>
                        <p>{rating}</p>
                    </span>
                </div>
            </div>
            <div className='comments'>
                <div className='comment-form'>
                    <PostComment id={id} onCommentPosted={handleCommentPosted} userName={userName}/>
                </div>
                {comments.map(comment => (
                    <div className={`comment ${comment.prediction?"green":"red"}`} key={comment.id}>
                        {comment.content} ------- {comment.username}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieInfo;
