/* eslint-disable react/prop-types */
// src/Login.js
import  { useState } from 'react';
import "./Login.css"
import { useNavigate } from 'react-router-dom';

const backURL=import.meta.env.VITE_BACKEND_SITE

const Login = ({username,setUsername}) => {
    // const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError]=useState(null)
    let navigate=useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null)
        try {
            const response = await fetch(`${backURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            const invalid=data["invalid"]

            if(invalid==="username"|| invalid==="password"){
                setError(()=>`${invalid} Invalid`);
                console.log(error)
            }
            else{
            console.log('Success:', data);
            localStorage.setItem('username',JSON.stringify(username))
            navigate('/movie')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className='login-form' >
                <label>
                    Username:
                    <br/>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                </label>
                <label>
                    Password:
                    <br/>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
