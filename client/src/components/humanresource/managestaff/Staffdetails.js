// StaffDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StaffDetail.css';

const Staffdetails = () => {
    const { id } = useParams();
    const [staff, setStaff] = useState(null);
    const navigate = useNavigate();

    //  dummy data
    const dummyStaffData = [
        {
            id: 1, name: 'John Doe', role: 'Manager', salary: 4500, shift: 'Morning - 6:00',
            address: '123 Main St, Cityville', phone: '123-456-7890',
            nextOfKin: { name: 'Alice Doe', relationship: 'Wife', phone: '123-456-7891', address: '123 Main St, Cityville' }
        },
        {
            id: 2, name: 'Jane Smith', role: 'Receptionist', salary: 3000, shift: 'Afternoon - 12:00',
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
        },
        { 
            id: 3, name: 'Robert Johnson', role: 'Housekeeper', salary: 2800, shift: 'Evening - 16:00',
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
         },

        { 
            id: 4, name: 'Emily Davis', role: 'Chef', salary: 4000, shift: 'Morning - 7:00 ', 
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
        },
        { 
            id: 5, name: 'Michael Brown', role: 'Bartender', salary: 3200, shift: 'Afternoon - 13:00',
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
        },
        { 
            id: 6, name: 'Linda Wilson', role: 'Security', salary: 3500, shift: 'Night - 22:00',
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
        },
        { 
            id: 7, name: 'David Lee', role: 'Concierge', salary: 2900, shift: 'Morning - 8:00',
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
        },
        { 
            id: 8, name: 'Jessica Taylor', role: 'Waitstaff', salary: 2700, shift: 'Afternoon - 11:00',
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
        },
        { 
            id: 9, name: 'Daniel Martinez', role: 'Gardener', salary: 2500, shift: 'Morning - 5:00' ,
            address: '456 Elm St, Townsville', phone: '987-654-3210',
            nextOfKin: { name: 'Bob Smith', relationship: 'Brother', phone: '987-654-3211', address: '456 Elm St, Townsville' }
        },
        {
            id: 10, name: 'Sarah Garcia', role: 'Spa Therapist', salary: 3000, shift: 'Evening - 15:00',
            address: '789 Oak St, Villageburg', phone: '789-012-3456',
            nextOfKin: { name: 'Charlie Garcia', relationship: 'Father', phone: '789-012-3457', address: '789 Oak St, Villageburg' }
        }
    ];

    useEffect(() => {
        const fetchStaffDetail = async () => {
            try {
                const response = await axios.get(`/api/staff/${id}`);
                setStaff(response.data);
            } catch (error) {
                console.error('Failed to fetch staff details', error);
                const dummyData = dummyStaffData.find(staff => staff.id === parseInt(id));
                setStaff(dummyData);
            }
        };
        fetchStaffDetail();
    }, [id]);

    if (!staff) return <div>Loading...</div>;

    return (
        <div className="staff-detail">
            <h1>Staff Details</h1>
            <div className="staff-info">
                <p><strong>Name:</strong> {staff.name}</p>
                <p><strong>Role:</strong> {staff.role}</p>
                <p><strong>Salary:</strong> ${staff.salary}</p>
                <p><strong>Shift:</strong> {staff.shift}</p>
                <p><strong>Residence Address:</strong> {staff.address}</p>
                <p><strong>Phone Number:</strong> {staff.phone}</p>
                <h2>Next of Kin</h2>
                <p><strong>Name:</strong> {staff.nextOfKin.name}</p>
                <p><strong>Relationship:</strong> {staff.nextOfKin.relationship}</p>
                <p><strong>Phone Number:</strong> {staff.nextOfKin.phone}</p>
                <p><strong>Residence Address:</strong> {staff.nextOfKin.address}</p>
            </div>
            <button className="back-button" onClick={() => navigate('/manageStaff')}>
                Back to Staff List
            </button>
        </div>
    );
};

export default Staffdetails;
