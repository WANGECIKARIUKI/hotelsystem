import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

function Changepassword() {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/change-password', {
        username,
        oldPassword,
        newPassword,
      });
      if (response.data.success) {
        setMessage('Password changed successfully.');
      }
    } catch (err) {
      setMessage('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleChangePassword}>
        <h2>Change Password</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Changepassword;
