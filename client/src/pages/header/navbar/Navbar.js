import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import './navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo">
          <h2><span style = {{color: 'coralblue'}}>Hotel </span> Management</h2>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/settings">
            <FaCog size={24} /> {/* Settings icon */}
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <FaSignOutAlt size={24} /> {/* Logout icon */}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
