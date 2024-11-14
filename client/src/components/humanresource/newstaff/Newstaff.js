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
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="middleName" placeholder="Middle Name (Optional)" onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        
        <select name="idCardType" onChange={handleChange} required>
          <option value="">Select ID Card Type</option>
          <option value="Passport">Passport</option>
          <option value="Driver's License">Driver's License</option>
          <option value="National ID">National ID</option>
        </select>
        <input name="idCardNumber" placeholder="ID Card Number" onChange={handleChange} required />
        <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
        <input name="residence" placeholder="Residence" onChange={handleChange} required />
        
        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Manager">Manager</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Security">Security</option>
        </select>
        
        <select name="shiftType" onChange={handleChange} required>
          <option value="">Select Shift Type</option>
          <option value="Morning">Morning (6 AM - 2 PM)</option>
          <option value="Afternoon">Afternoon (2 PM - 10 PM)</option>
          <option value="Night">Night (10 PM - 6 AM)</option>
        </select>
        
        <input name="salary" type="number" placeholder="Salary" onChange={handleChange} required />
      </div>

      <div className="next-of-kin-section">
        <h3>Next of Kin Details</h3>
        <input name="nextOfKin.firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="nextOfKin.lastName" placeholder="Last Name" onChange={handleChange} required />
        
        <select name="nextOfKin.relation" onChange={handleChange} required>
          <option value="">Select Relation</option>
          <option value="Mother">Mother</option>
          <option value="Father">Father</option>
          <option value="Brother">Brother</option>
          <option value="Sister">Sister</option>
          <option value="Aunt">Aunt</option>
          <option value="Uncle">Uncle</option>
          <option value="Guardian">Guardian</option>
        </select>
        
        <input name="nextOfKin.contactNumber" placeholder="Contact Number" onChange={handleChange} required />
        <input name="nextOfKin.email" type="email" placeholder="Email Address" onChange={handleChange} required />
        <input name="nextOfKin.residence" placeholder="Residence" onChange={handleChange} required />
      </div>

      <div className="form-buttons">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  );
}

export default Newstaff;
