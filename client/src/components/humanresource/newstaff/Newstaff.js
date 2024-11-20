import React, { useState } from 'react';
import './Staff.css';

function Newstaff({ hotelId }) {
  const [employee, setEmployee] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    idCardType: '',
    idCardNumber: '',
    contactNumber: '',
    email: '',
    residence: '',
    role: '',
    shiftType: '',
    salary: '',
    nextOfKin: {
      firstName: '',
      lastName: '',
      relation: '',
      contactNumber: '',
      email: '',
      residence: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nextOfKin')) {
      setEmployee((prev) => ({
        ...prev,
        nextOfKin: {
          ...prev.nextOfKin,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/create_staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...employee, hotel_id: hotelId }),
      });
      if (response.ok) alert('Employee created successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="staff-form" onSubmit={handleSubmit}>
      <div className="employee-section">
        <h3>Employee Details</h3>
        
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input id="firstName" name="firstName" onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="middleName">Middle Name (Optional):</label>
          <input id="middleName" name="middleName" onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input id="lastName" name="lastName" onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="idCardType">ID Card Type:</label>
          <select id="idCardType" name="idCardType" onChange={handleChange} required>
            <option value="">Select ID Card Type</option>
            <option value="Passport">Passport</option>
            <option value="Driver's License">Driver's License</option>
            <option value="National ID">National ID</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="idCardNumber">ID Card Number:</label>
          <input id="idCardNumber" name="idCardNumber" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input id="contactNumber" name="contactNumber" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input id="email" name="email" type="email" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="residence">Residence:</label>
          <input id="residence" name="residence" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select id="role" name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Security">Security</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="shiftType">Shift Type:</label>
          <select id="shiftType" name="shiftType" onChange={handleChange} required>
            <option value="">Select Shift Type</option>
            <option value="Morning">Morning (6 AM - 2 PM)</option>
            <option value="Afternoon">Afternoon (2 PM - 10 PM)</option>
            <option value="Night">Night (10 PM - 6 AM)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary:</label>
          <input id="salary" name="salary" type="number" onChange={handleChange} required />
        </div>
      </div>

      <div className="next-of-kin-section">
        <h3>Next of Kin Details</h3>

        <div className="form-group">
          <label htmlFor="nextOfKin.firstName">First Name:</label>
          <input id="nextOfKin.firstName" name="nextOfKin.firstName" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="nextOfKin.lastName">Last Name:</label>
          <input id="nextOfKin.lastName" name="nextOfKin.lastName" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="nextOfKin.relation">Relation:</label>
          <select id="nextOfKin.relation" name="nextOfKin.relation" onChange={handleChange} required>
            <option value="">Select Relation</option>
            <option value="Mother">Mother</option>
            <option value="Father">Father</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Aunt">Aunt</option>
            <option value="Uncle">Uncle</option>
            <option value="Guardian">Guardian</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nextOfKin.contactNumber">Contact Number:</label>
          <input id="nextOfKin.contactNumber" name="nextOfKin.contactNumber" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="nextOfKin.email">Email Address:</label>
          <input id="nextOfKin.email" name="nextOfKin.email" type="email" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="nextOfKin.residence">Residence:</label>
          <input id="nextOfKin.residence" name="nextOfKin.residence" onChange={handleChange} required />
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  );
}

export default Newstaff;
