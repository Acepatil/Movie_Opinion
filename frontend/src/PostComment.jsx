/* eslint-disable react/prop-types */
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostComment.css'; // Import the CSS file

function PostComment({ id, onCommentPosted ,userName}) {
    const backURL = import.meta.env.VITE_BACKEND_SITE;

    const [comment,setComment]=useState('')
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      };
    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
            const response = await fetch(`${backURL}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({comment,movie_id:Number(id),username:userName}),
            });
            const result = await response.json();
            if (result.error) {
                console.error('Error:', result.error);
            } else {
                onCommentPosted();
                setComment("")
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
            <form onSubmit={handleSubmit} className='comment-form' >
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                        onKeyDown={handleKeyPress}
                        required
                    />
                <button type="submit" >Submit</button>
            </form>
    );
}

export default PostComment;
