import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Staff.css';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons for actions

const Managestaff = ({ hotelId }) => {
    const [staffList, setStaffList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [staffPerPage, setStaffPerPage] = useState(10); // Default to show 10 staff members per page
    const [selectedStaff, setSelectedStaff] = useState(null); // For editing and viewing staff details
    const [newShift, setNewShift] = useState('');
    const [showEditPopup, setShowEditPopup] = useState(false); // For editing staff
    const [staffDetails, setStaffDetails] = useState({
        name: '',
        phone_number: '',
        address: '',
        role: '',
        joining_date: '',
        next_of_kin_name: '',
        next_of_kin_phone: '',
        salary: ''
    });
    const navigate = useNavigate();

    // Dummy data
    const dummyStaffData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Employee ${i + 1}`,
        phone_number: `123-456-789${i % 10}`,
        address: `Address ${i + 1}`,
        role: `Role ${i + 1}`,
        shift: `${6 + (i % 3)}:00`, // Shifts rotating between 6, 7, and 8
        joining_date: new Date(Date.now() - (i * 1000 * 60 * 60 * 24 * 30)).toISOString(), // Joining dates staggered by months
        next_of_kin_name: `Kin ${i + 1}`,
        next_of_kin_phone: `987-654-321${i % 10}`,
        salary: Math.floor(Math.random() * 3000) + 2000, // Random salary between 2000 and 5000
    }));

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`/api/staff?hotel_id=${hotelId}`);
            setStaffList(response.data);
        } catch (error) {
            console.error('Error fetching staff data:', error);
            setStaffList(dummyStaffData); // If fetch fails, fall back to dummy data
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [hotelId]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/staff/${id}`);
            fetchStaff(); // Refresh the staff list after deletion
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    };

    const handleChangeShift = async (staff) => {
        try {
            await axios.patch(`/api/staff/${staff.id}/shift`, { shift: newShift });
            fetchStaff(); // Refresh the staff list after shift change
        } catch (error) {
            console.error('Error changing shift:', error);
        }
    };

    const handleEditStaff = async () => {
        try {
            await axios.put(`/api/update_staff/${selectedStaff.id}`, staffDetails);
            setShowEditPopup(false); // Close the edit popup
            fetchStaff(); // Refresh the staff list after update
        } catch (error) {
            console.error('Error updating staff:', error);
        }
    };

    const handleViewDetails = (staff) => {
        navigate(`/staff/${staff.id}`); // Navigate to the details page
    };

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastStaff = currentPage * staffPerPage;
    const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
    const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderShift = (shift) => {
        const hour = parseInt(shift.split(':')[0]);
        let startTime = `${hour}:00`;
        let endTime = `${(hour + 6) % 24}:00`; // Assume each shift is 6 hours

        // Format for AM/PM
        const formatTime = (time) => {
            const [h, m] = time.split(':');
            const period = h >= 12 ? 'PM' : 'AM';
            const hourFormatted = (h % 12) || 12; // Convert to 12-hour format
            return `${hourFormatted}:${m} ${period}`;
        };

        let shiftType;
        if (hour < 12) {
            shiftType = 'Morning';
        } else if (hour < 18) {
            shiftType = 'Afternoon';
        } else {
            shiftType = 'Evening';
        }

        return `${shiftType} - ${formatTime(startTime)} - ${formatTime(endTime)}`;
    };

    return (
        <div className="container">
            <div className="manage-staff">
                <h1>Manage Staff</h1>
                <button style = {{justifyContent: 'end', textAlign: 'end'}} onClick={() => navigate('/newstaff')}>Add Employee</button>
                <div className="show-entries">
                    <span>Show entries</span>
                    <select value={staffPerPage} onChange={(e) => {
                        setStaffPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page on changing entries
                    }}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Employee Name</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Staff Role</th>
                            <th>Shift</th>
                            <th>Joining Date</th>
                            <th>Next of Kin Name</th>
                            <th>Next of Kin Phone</th>
                            <th>Salary</th>
                            <th>Change Shift</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStaff.map((staff, index) => (
                            <tr key={staff.id}>
                                <td>{index + 1 + indexOfFirstStaff}</td>
                                <td>{staff.name}</td>
                                <td>{staff.phone_number}</td>
                                <td>{staff.address}</td>
                                <td>{staff.role}</td>
                                <td>{renderShift(staff.shift)}</td>
                                <td>{new Date(staff.joining_date).toLocaleDateString()}</td>
                                <td>{staff.next_of_kin_name}</td>
                                <td>{staff.next_of_kin_phone}</td>
                                <td>{staff.salary}</td>
                                <td>
                                    <select onChange={(e) => setNewShift(e.target.value)} defaultValue="">
                                        <option value="" disabled>Select Shift</option>
                                        {[...Array(24)].map((_, i) => (
                                            <option key={i} value={`${i}:00`}>{renderShift(`${i}:00`)}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleChangeShift(staff)}>Change</button>
                                </td>
                                <td>
    <div className="action-buttons">
        <FaEye
            className="action-icon"
            onClick={() => handleViewDetails(staff)}
        />
        <FaEdit
            className="action-icon"
            onClick={() => {
                setSelectedStaff(staff);
                setStaffDetails({
                    name: staff.name,
                    phone_number: staff.phone_number,
                    address: staff.address,
                    role: staff.role,
                    joining_date: staff.joining_date,
                    next_of_kin_name: staff.next_of_kin_name,
                    next_of_kin_phone: staff.next_of_kin_phone,
                    salary: staff.salary,
                });
                setShowEditPopup(true);
            }}
        />
        <FaTrash
            className="action-icon"
            onClick={() => handleDelete(staff.id)}
        />
    </div>
</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastStaff >= filteredStaff.length}>
                        Next
                    </button>
                </div>
                {/* Edit Popup */}
                <div className="popup" style={{ display: showEditPopup ? 'block' : 'none' }}>
                    <div className="popup-content">
                        <h2>Edit Staff</h2>
                        <label>Name:</label>
                        <input type="text" value={staffDetails.name} onChange={(e) => setStaffDetails({ ...staffDetails, name: e.target.value })} />
                        <label>Phone:</label>
                        <input type="text" value={staffDetails.phone_number} onChange={(e) => setStaffDetails({ ...staffDetails, phone_number: e.target.value })} />
                        <label>Address:</label>
                        <input type="text" value={staffDetails.address} onChange={(e) => setStaffDetails({ ...staffDetails, address: e.target.value })} />
                        <label>Role:</label>
                        <input type="text" value={staffDetails.role} onChange={(e) => setStaffDetails({ ...staffDetails, role: e.target.value })} />
                        <label>Joining Date:</label>
                        <input type="date" value={staffDetails.joining_date.split('T')[0]} onChange={(e) => setStaffDetails({ ...staffDetails, joining_date: e.target.value })} />
                        <label>Next of Kin Name:</label>
                        <input type="text" value={staffDetails.next_of_kin_name} onChange={(e) => setStaffDetails({ ...staffDetails, next_of_kin_name: e.target.value })} />
                        <label>Next of Kin Phone:</label>
                        <input type="text" value={staffDetails.next_of_kin_phone} onChange={(e) => setStaffDetails({ ...staffDetails, next_of_kin_phone: e.target.value })} />
                        <label>Salary:</label>
                        <input type="text" value={staffDetails.salary} onChange={(e) => setStaffDetails({ ...staffDetails, salary: e.target.value })} />
                        <button onClick={handleEditStaff}>Update</button>
                        <button onClick={() => setShowEditPopup(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Managestaff;
