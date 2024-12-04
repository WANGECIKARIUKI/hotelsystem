import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  // Dummy credentials (for frontend authentication)
  const DUMMY_CREDENTIALS = {
    admin: 'password123',
    user: 'user123',
  };

  useEffect(() => {
    if (attempts >= 5) {
      setError('Account locked due to too many failed login attempts.');
    }
  }, [attempts]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (attempts >= 5) {
      setError('Account is locked. Please contact support to change your password.');
      return;
    }

    // Check if credentials match dummy data
    if (DUMMY_CREDENTIALS[username] === password) {
      onLoginSuccess();
      navigate('/dashboard');
      return;
    }

    // If not dummy, send request to the backend
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      if (response.data) {
        onLoginSuccess();
        navigate('/dashboard');
      }
    } catch (err) {
      setAttempts(prev => prev + 1);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Welcome! Please Login to Proceed</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={attempts >= 5}>
          Login
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
