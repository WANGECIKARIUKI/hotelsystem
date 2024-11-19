import React, { useState, useEffect } from 'react';
import './housekeeping.css';

function Housekeeping() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [formData, setFormData] = useState({
        room_number: '',
        room_type: '',
        housekeeping_status: '',
        priority: 'low',
        reservation_status: '',
        comments: ''
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage, setRoomsPerPage] = useState(10);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = () => {
        fetch('/api/housekeeping/rooms', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            setRooms(data);
            setFilteredRooms(data); // set initial filteredRooms
        })
        .catch(error => {
            console.error('Error fetching rooms:', error);
            // Dummy data in case fetch fails
            const dummyData = [
                { id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },
                { id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },{ id: 1, room_number: '101', room_type: 'Single', housekeeping_status: 'dirty', priority: 'low', reservation_status: 'checked_in', comments: 'Requires cleaning' },
                { id: 2, room_number: '102', room_type: 'Double', housekeeping_status: 'clean', priority: 'high', reservation_status: 'due_in', comments: '' },
                { id: 3, room_number: '103', room_type: 'Suite', housekeeping_status: 'cleaning_in_progress', priority: 'low', reservation_status: 'due_out', comments: '' },
                // Add more data if needed
            ];
            setRooms(dummyData);
            setFilteredRooms(dummyData);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));

        // Filter rooms based on input
        const filtered = rooms.filter(room =>
            (formData.room_number === '' || room.room_number.includes(formData.room_number)) &&
            (formData.room_type === '' || room.room_type === formData.room_type) &&
            (formData.housekeeping_status === '' || room.housekeeping_status === formData.housekeeping_status) &&
            (formData.priority === '' || room.priority === formData.priority) &&
            (formData.reservation_status === '' || room.reservation_status === formData.reservation_status)
        );
        setFilteredRooms(filtered);
    };

    const handleStatusUpdate = (id, key, value) => {
        const updatedRooms = rooms.map(room =>
            room.id === id ? { ...room, [key]: value } : room
        );
        setRooms(updatedRooms);
        setFilteredRooms(updatedRooms);
    };

    // Pagination Logic
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="housekeeping">
            <h1>Housekeeping Management</h1>
            <section className="housekeeping-form">
                <h2>Filter Rooms</h2>
                <form>
                    <div className="form-group">
                        <input name="room_number" type="text" placeholder="Room Number" value={formData.room_number} onChange={handleInputChange} />
                        <select name="room_type" value={formData.room_type} onChange={handleInputChange}>
                            <option value="">Select Room Type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                            <option value="Family">Family</option>
                        </select>
                        <select name="housekeeping_status" value={formData.housekeeping_status} onChange={handleInputChange}>
                            <option value="">Housekeeping Status</option>
                            <option value="clean">Clean</option>
                            <option value="cleaning_in_progress">Cleaning in Progress</option>
                            <option value="dirty">Dirty</option>
                            <option value="out_of_service">Out of Service</option>
                        </select>
                        <select name="priority" value={formData.priority} onChange={handleInputChange}>
                            <option value="low">Low Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                        <select name="reservation_status" value={formData.reservation_status} onChange={handleInputChange}>
                            <option value="">Reservation Status</option>
                            <option value="due_in">Due In</option>
                            <option value="checked_in">Checked In</option>
                            <option value="due_out">Due Out</option>
                        </select>
                    </div>
                </form>
            </section>
            <section className="housekeeping-list">
                <h2>Room List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Room Type</th>
                            <th>Housekeeping Status</th>
                            <th className="priority-column">Priority</th>
                            <th>Reservation Status</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRooms.map(room => (
                            <tr key={room.id}>
                                <td>{room.room_number}</td>
                                <td>{room.room_type}</td>
                                <td>
                                    <select
                                        className={`status-select ${room.housekeeping_status}`}
                                        value={room.housekeeping_status}
                                        onChange={(e) => handleStatusUpdate(room.id, 'housekeeping_status', e.target.value)}
                                    >
                                        <option value="clean">Clean</option>
                                        <option value="cleaning_in_progress">Cleaning in Progress</option>
                                        <option value="dirty">Dirty</option>
                                        <option value="out_of_service">Out of Service</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        className={`priority-select ${room.priority}`}
                                        value={room.priority}
                                        onChange={(e) => handleStatusUpdate(room.id, 'priority', e.target.value)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="high">High</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        className={`reservation-status ${room.reservation_status}`}
                                        value={room.reservation_status}
                                        onChange={(e) => handleStatusUpdate(room.id, 'reservation_status', e.target.value)}
                                    >
                                        <option value="due_in">Due In</option>
                                        <option value="checked_in">Checked In</option>
                                        <option value="due_out">Due Out</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={room.comments}
                                        onChange={(e) => handleStatusUpdate(room.id, 'comments', e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastRoom >= filteredRooms.length}>Next</button>
                </div>
            </section>
        </div>
    );
}

export default Housekeeping;
