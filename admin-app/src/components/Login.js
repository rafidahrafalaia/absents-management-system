import React, { useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken } from './Auth.js';
import api from '../api/api.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            if (response.data.token) {
                setToken(response.data.token);
                navigate('/');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to log in. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <form onSubmit={handleLogin}>
                    <h2 className="login-title">Login to your admin account</h2>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email address:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-options">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="rememberMe" />
                            <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
                        </div>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
