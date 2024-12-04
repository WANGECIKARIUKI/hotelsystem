import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout action when this page is rendered
    onLogout();
    
    // Redirect to login page after a brief delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 1000); // 1-second delay for user experience

    return () => clearTimeout(timer);
  }, [onLogout, navigate]);

  return (
    <div className="logout-container">
      <h2>You have been logged out.</h2>
      <p>Redirecting to login page...</p>
    </div>
  );
}

export default Logout;
