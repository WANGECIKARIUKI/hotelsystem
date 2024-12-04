import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ onLogout }) => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For hamburger menu

  const toggleReportsDropdown = () => {
    setIsReportsOpen(!isReportsOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link">
            <i className="fas fa-home sidebar-icon home-icon"></i>
            <span className="sidebar-text">Dashboard</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/reservation" className="sidebar-link">
            <i className="fas fa-calendar-check sidebar-icon reservation-icon"></i>
            <span className="sidebar-text">Reservations Form</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/managerooms" className="sidebar-link">
            <i className="fas fa-bed sidebar-icon manage-rooms-icon"></i>
            <span className="sidebar-text">Manage Rooms</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/frontdesk" className="sidebar-link">
            <i className="fas fa-cogs sidebar-icon front-desk-icon"></i>
            <span className="sidebar-text">Front Desk</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/guestmanagement" className="sidebar-link">
            <i className="fas fa-users sidebar-icon guest-management-icon"></i>
            <span className="sidebar-text">Guest Management</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/communication" className="sidebar-link">
            <i className="fas fa-comments sidebar-icon communication-icon"></i>
            <span className="sidebar-text">Communications</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/housekeeping" className="sidebar-link">
            <i className="fas fa-broom sidebar-icon housekeeping-icon"></i>
            <span className="sidebar-text">Housekeeping</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/services" className="sidebar-link">
            <i className="fas fa-concierge-bell sidebar-icon services-icon"></i>
            <span className="sidebar-text">Services</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/category" className="sidebar-link">
            <i className="fas fa-th-large sidebar-icon category-icon"></i>
            <span className="sidebar-text">Categories</span>
          </Link>
        </li>
        <li className="sidebar-item">
  <Link to="/createcategory" className="sidebar-link">
    <i className="fas fa-tags sidebar-icon category-icon"></i> {/* Add Categories Icon */}
    <span className="sidebar-text">Add Categories</span>
  </Link>
</li>

        <li className="sidebar-item">
          <Link to="/orders" className="sidebar-link">
            <i className="fas fa-box sidebar-icon orders-icon"></i>
            <span className="sidebar-text">Orders</span>
          </Link>
        </li>
        <li className="sidebar-item">
  <Link to="/createorder" className="sidebar-link">
  <i className="fas fa-clipboard-list sidebar-icon"></i>
    <span className="sidebar-text">Add Orders</span>
  </Link>
</li>

        <li className="sidebar-item">
          <Link to="/inventory" className="sidebar-link">
            <i className="fas fa-archive sidebar-icon inventory-icon"></i>
            <span className="sidebar-text">Inventory Management</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/invoicelist" className="sidebar-link">
            <i className="fas fa-file-invoice sidebar-icon invoices-icon"></i>
            <span className="sidebar-text">Invoice Generation</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/newstaff" className="sidebar-link">
            <i className="fas fa-user-plus sidebar-icon new-staff-icon"></i>
            <span className="sidebar-text">New Staff</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/managestaff" className="sidebar-link">
            <i className="fas fa-users-cog sidebar-icon manage-staff-icon"></i>
            <span className="sidebar-text">Manage Staff</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/managecomplaints" className="sidebar-link">
            <i className="fas fa-exclamation-circle sidebar-icon complaints-icon"></i>
            <span className="sidebar-text">Manage Complaints</span>
          </Link>
        </li>
        {/* Reports Dropdown */}
        <li className="sidebar-item" onClick={toggleReportsDropdown}>
          <i className="fas fa-file-alt sidebar-icon reports-icon"></i>
          <span className="sidebar-text">Reports</span>
          <i className={`fas ${isReportsOpen ? 'fa-angle-up' : 'fa-angle-down'} dropdown-icon`}></i>
        </li>
        {isReportsOpen && (
          <ul className="dropdown">
          <li className="dropdown-item">
            <Link to="/inventoryreport" className="dropdown-link">
              <i className="fas fa-box dropdown-icon"></i> {/* Inventory Report Icon */}
              Inventory Report
            </Link>
          </li>
          <li className="dropdown-item">
            <Link to="/orderreport" className="dropdown-link">
              <i className="fas fa-file-alt dropdown-icon"></i> {/* Order Report Icon */}
              Order Report
            </Link>
          </li>
          <li className="dropdown-item">
            <Link to="/servicereport" className="dropdown-link">
              <i className="fas fa-concierge-bell dropdown-icon"></i> {/* Service Report Icon */}
              Service Report
            </Link>
          </li>
          <li className="dropdown-item">
            <Link to="/guestreport" className="dropdown-link">
              <i className="fas fa-users dropdown-icon"></i> {/* Guest Report Icon */}
              Guest Report
            </Link>
          </li>
        </ul>
        
        )}
        <li className="sidebar-item">
          <Link to="/settings" className="sidebar-link">
            <i className="fas fa-cogs sidebar-icon settings-icon"></i>
            <span className="sidebar-text">Settings</span>
          </Link>
        </li>
        <li className="sidebar-item" style={{ cursor: 'pointer' }}>
  <Link to="/changepassword" className="sidebar-link">
    <i className="fas fa-key sidebar-icon"></i>
    <span className="sidebar-text">Change Password</span>
  </Link>
</li>
        <li className="sidebar-item" onClick={onLogout} style={{ cursor: 'pointer', color: 'red' }}>
          <Link to="/logout" className="sidebar-link">
            <i className="fas fa-sign-out-alt sidebar-icon logout-icon"></i>
            <span className="sidebar-text">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
