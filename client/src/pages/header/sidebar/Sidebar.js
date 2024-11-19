import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const toggleReportsDropdown = () => {
    setIsReportsOpen(!isReportsOpen);
  };

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
          <Link to="/communication" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Communications</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/housekeeping" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Housekeeping</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/services" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Services</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/category" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Categories</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/orders" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Orders</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/inventory" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Inventory Management</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/invoices" className="sidebar-link">
            <i className="fas fa-user sidebar-icon"></i>
            <span className="sidebar-text">Invoice Generation</span>
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
         {/* Reports Dropdown */}
         <li className="sidebar-item" onClick={toggleReportsDropdown}>
          <i className="fas fa-file-alt sidebar-icon"></i>
          <span className="sidebar-text">Reports</span>
          <i className={`fas ${isReportsOpen ? 'fa-angle-up' : 'fa-angle-down'} dropdown-icon`}></i>
        </li>
        {isReportsOpen && (
          <ul className="dropdown">
            <li className="dropdown-item">
              <Link to="/inventoryreport" className="dropdown-link">Inventory Report</Link>
            </li>
            <li className="dropdown-item">
              <Link to="/revenue-report" className="dropdown-link">Revenue Report</Link>
            </li>
            <li className="dropdown-item">
              <Link to="/employee-report" className="dropdown-link">Employee Report</Link>
            </li>
            <li className="dropdown-item">
              <Link to="/rooms-report" className="dropdown-link">Rooms Report</Link>
            </li>
          </ul>
        )}
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
