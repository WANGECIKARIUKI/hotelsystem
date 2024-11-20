import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Roommodal from './Roommodal';
import './Managerooms.css';
import { FaEdit, FaTrashAlt, FaEye, FaPlus } from 'react-icons/fa';

const Managerooms = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [hotelId] = useState(1);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const fetchRooms = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/rooms?hotel_id=${hotelId}`);
            const data = await response.json();
            console.log("Fetched data:", data);

            if (!response.ok || data.length === 0) {
                const dummyRooms = Array.from({ length: 50 }, (_, index) => ({
                    id: index + 1,
                    room_number: `Room ${index + 1}`,
                    room_type: index % 2 === 0 ? 'Single' : 'Double',
                    booking_status: index % 3 === 0,
                }));
                setRooms(dummyRooms);
                setMessage('No rooms found, displaying dummy data.');
            } else {
                setRooms(data);
                setMessage('Rooms fetched successfully.');
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setMessage('Failed to fetch rooms, displaying dummy data.');
            const dummyRooms = Array.from({ length: 50 }, (_, index) => ({
                id: index + 1,
                room_number: `Room ${index + 1}`,
                room_type: index % 2 === 0 ? 'Single' : 'Double',
                booking_status: index % 3 === 0,
            }));
            setRooms(dummyRooms);
        }
    }, [hotelId]);

    const fetchReservations = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/reservations?hotel_id=${hotelId}`);
            const data = await response.json();
            console.log("Fetched reservations data:", data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    }, [hotelId]);

    useEffect(() => {
        fetchRooms();
        fetchReservations();
    }, [fetchRooms, fetchReservations]);

    const handleAddRoom = async (newRoom) => {
        const response = await fetch(`http://localhost:5000/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newRoom, hotel_id: hotelId })
        });
        response.ok ? fetchRooms() : setMessage('Failed to add room.');
    };

    const handleCheckIn = async (room) => {
        const response = await fetch(`http://localhost:5000/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_id: room.id, hotel_id: hotelId, customer_name: 'Customer Name' })
        });
        response.ok ? fetchRoomsAndReservations('Check-in successful!') : setMessage('Check-in failed.');
    };

    const handleCheckOut = async (room) => {
        const response = await fetch(`http://localhost:5000/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_id: room.id, hotel_id: hotelId })
        });
        response.ok ? fetchRoomsAndReservations('Check-out successful!') : setMessage('Check-out failed.');
    };

    const fetchRoomsAndReservations = (successMessage) => {
        fetchRooms();
        fetchReservations();
        setMessage(successMessage);
    };

    const handlePageChange = (direction) => {
        setCurrentPage(prevPage => direction === 'next' 
            ? Math.min(prevPage + 1, Math.ceil(rooms.length / entriesPerPage)) 
            : Math.max(prevPage - 1, 1)
        );
    };

    const indexOfLastRoom = currentPage * entriesPerPage;
    const indexOfFirstRoom = indexOfLastRoom - entriesPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

    return (
        <div className="container">
            <div className="managerooms-container">
                <h2>Manage Rooms</h2>
                {message && <p className="message">{message}</p>}
                <div className="controls">
                    <select onChange={(e) => setEntriesPerPage(e.target.value)} value={entriesPerPage}>
                        <option value="5">Show 5</option>
                        <option value="10">Show 10</option>
                        <option value="25">Show 25</option>
                        <option value="50">Show 50</option>
                    </select>
                    <button className="add-room-button" onClick={() => setModalData({ action: 'add' })}>
                        <FaPlus /> Add Room
                    </button>
                </div>
                <table className="rooms-table">
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Room Type</th>
                            <th>Booking Status</th>
                            <th>Book</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRooms.map((room) => (
                            <tr key={room.id}>
                                <td>{room.room_number}</td>
                                <td>{room.room_type}</td>
                                <td>{room.booking_status ? 'Booked' : 'Available'}</td>
                                <td>
                                    {!room.booking_status && (
                                        <button 
                                            className="book-button"
                                            onClick={() => navigate("/reservation")}
                                        >
                                            Book
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        className="checkin-button"
                                        onClick={() => setModalData({ action: 'checkin', room })}
                                        disabled={room.booking_status}
                                    >
                                        Check In
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        className="checkout-button"
                                        onClick={() => setModalData({ action: 'checkout', room })}
                                        disabled={!room.booking_status}
                                    >
                                        Check Out
                                    </button>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => setModalData({ action: 'view', room })}>
                                            <FaEye />
                                        </button>
                                        <button onClick={() => setModalData({ action: 'edit', room })}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleCheckOut(room)}>
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {Math.ceil(rooms.length / entriesPerPage)}</span>
                    <button onClick={() => handlePageChange('next')} disabled={indexOfLastRoom >= rooms.length}>Next</button>
                </div>
                {modalData && (
                    <Roommodal
                        modalData={modalData}
                        onClose={() => setModalData(null)}
                        onAddRoom={handleAddRoom}
                        onCheckIn={handleCheckIn}
                        onCheckOut={handleCheckOut}
                    />
                )}
            </div>
        </div>
    );
};

export default Managerooms;
