import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/" className="sidebar-link">
            <i className="fas fa-home sidebar-icon"></i>
            <span className="sidebar-text">Dashboard</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Profile</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/reservations" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Reservations Form</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/managerooms" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Manage Rooms</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/frontdesk" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Front Desk</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/guestmanagement" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Guest Management</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/newstaff" className="sidebar-link">
            <i className="fas fa-user-plus sidebar-icon"></i>
            <span className="sidebar-text">New Staff</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/managestaff" className="sidebar-link">
            <i className="fas fa-users-cog sidebar-icon"></i>
            <span className="sidebar-text">Manage Staff</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/managecomplaints" className="sidebar-link">
            <i className="fas fa-bell-slash sidebar-icon"></i> {/* Or use fa-exclamation-circle */}
            <span className="sidebar-text">Manage Complaints</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/settings" className="sidebar-link">
            <i className="fas fa-cogs sidebar-icon"></i>
            <span className="sidebar-text">Settings</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/logout" className="sidebar-link">
            <i className="fas fa-sign-out-alt sidebar-icon"></i>
            <span className="sidebar-text">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
