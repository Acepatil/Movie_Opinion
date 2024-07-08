/* eslint-disable react/prop-types */
// src/Login.js
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backURL=import.meta.env.VITE_BACKEND_SITE

const Register = ({username,setUsername}) => {
    // const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError]=useState('')
    let navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null)
        try {
            const response = await fetch(`${backURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, username, password }),
            });
            const data = await response.json();
            const same=data["same"];
            if (same==="username"|| same==="email") {
                setError(()=>`${same} Already Exists`);
                console.log(error) 
            }
            else{
            console.log('Success:', data);
            navigate('/login')
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit} className='login-form'>
                <label>
                    Username:
                    <br></br>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ margin: '10px 0', padding: '10px' }}
                    />
                </label>
                <label>
                    Email:
                    <br/>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ margin: '10px 0', padding: '10px' }}
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
                        style={{ margin: '10px 0', padding: '10px' }}
                    />
                    <p>{error}</p>
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
