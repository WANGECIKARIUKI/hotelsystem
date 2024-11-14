import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import './Reservation.css';

function Reservation() {
    const [formData, setFormData] = useState({
        hotel_id: 1,
        room_type: '',
        room_number: '',
        check_in_date: '',
        check_out_date: '',
        no_of_rooms: '',
        no_of_children: '',
        no_of_adults: '',
        amount: '',
        first_name: '',
        last_name: '',
        email: '',
        home_address: '',
        telephone: ''
    });

    const [showPopup, setShowPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [reservedRooms, setReservedRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);

    const baseRates = {
        single: 100,
        double: 150,
        suite: 200
    };

    useEffect(() => {
        // Load rooms for the hotel on mount
        fetchReservedRooms();
    }, []);

    useEffect(() => {
        // Filter reserved rooms based on the search query
        if (searchQuery) {
            const filtered = reservedRooms.filter(room => 
                room.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.room_number.includes(searchQuery)
            );
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms(reservedRooms);
        }
    }, [searchQuery, reservedRooms]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const updatedData = { ...prevState, [name]: value };
            if (['room_type', 'no_of_rooms', 'no_of_adults', 'no_of_children'].includes(name)) {
                updatedData.amount = calculateAmount(updatedData);
            }
            return updatedData;
        });
    };

    const calculateAmount = (data) => {
        const roomRate = baseRates[data.room_type] || 0;
        const rooms = parseInt(data.no_of_rooms) || 1;
        const adults = parseInt(data.no_of_adults) || 0;
        const children = parseInt(data.no_of_children) || 0;
        
        const additionalGuestCharge = (adults + children) * 20;
        return roomRate * rooms + additionalGuestCharge;
    };

    const checkRoomAvailability = async () => {
        try {
            const response = await axios.get(`/rooms/availability`, {
                params: {
                    room_type: formData.room_type,
                    check_in_date: formData.check_in_date,
                    check_out_date: formData.check_out_date,
                    no_of_rooms: formData.no_of_rooms
                }
            });
            return response.data.available;
        } catch (error) {
            console.error("Error checking room availability:", error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some(field => !field)) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        setLoading(true);

        const isAvailable = await checkRoomAvailability();
        if (!isAvailable) {
            setErrorMessage("Selected room is not available for the given dates.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/reservations', formData);
            if (response.status === 201) {
                setShowPopup(true);
                setReservedRooms([...reservedRooms, { ...formData, id: response.data.id }]);
                setErrorMessage(''); // Reset error message
            }
        } catch (error) {
            console.error("Error creating reservation:", error);
            setErrorMessage("Failed to create reservation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async (id) => {
        try {
            setLoading(true);
            const response = await axios.post(`/checkout`, { room_id: id });
            if (response.status === 200) {
                setReservedRooms(reservedRooms.filter(room => room.id !== id));
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            setErrorMessage("Failed to check out. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReservedRooms = async () => {
        try {
            const response = await axios.get(`/rooms`, { params: { hotel_id: formData.hotel_id } });
            setReservedRooms(response.data);
        } catch (error) {
            console.error("Error fetching reserved rooms:", error);
            setErrorMessage("Could not load reserved rooms.");
        }
    };

    return (
        <div className="reservation-form">
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="section">
                    <h2>Room Information</h2>
                    <div className="form-row">
                        <input type="text" name="room_type" onChange={handleChange} placeholder="Room Type" required />
                        <input type="text" name="room_number" onChange={handleChange} placeholder="Room Number" required />
                    </div>
                    <div className="form-row">
                        <input type="date" name="check_in_date" onChange={handleChange} required />
                        <input type="date" name="check_out_date" onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <input type="number" name="no_of_rooms" onChange={handleChange} placeholder="No. of Rooms" required />
                        <input type="number" name="no_of_children" onChange={handleChange} placeholder="No. of Children" required />
                    </div>
                    <div className="form-row">
                        <input type="number" name="no_of_adults" onChange={handleChange} placeholder="No. of Adults" required />
                        <input type="text" name="amount" value={formData.amount} placeholder="Amount to be Charged" readOnly />
                    </div>
                </div>

                <section className="section">
                    <h2>Customer Information</h2>
                    <div className="form-row">
                        <input type="text" name="first_name" onChange={handleChange} placeholder="First Name" required />
                        <input type="text" name="last_name" onChange={handleChange} placeholder="Last Name" required />
                    </div>
                    <div className="form-row">
                        <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
                        <input type="text" name="home_address" onChange={handleChange} placeholder="Home Address" required />
                    </div>
                    <div className="form-row">
                        <input type="tel" name="telephone" onChange={handleChange} placeholder="Telephone Number" required />
                    </div>
                </section>

                <button type="submit" disabled={loading}>
                    {loading ? 'Booking...' : 'Book Now'}
                </button>
            </form>

            {loading && (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                </div>
            )}

            {showPopup && (
                <div className="popup">
                    <AiOutlineCheckCircle size={48} color="green" />
                    <h3>Reservation Confirmed!</h3>
                    <p>Details:</p>
                    <ul>
                        <li>{formData.first_name} {formData.last_name}</li>
                        <li>{formData.room_type} - Room {formData.room_number}</li>
                        <li>Check-in: {formData.check_in_date} | Check-out: {formData.check_out_date}</li>
                        <li>Total Amount: ${formData.amount}</li>
                    </ul>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            )}

            <section className="section">
                {/* Search Functionality */}
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by Guest Name or Room Number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <h2>Reserved Rooms</h2>
                {filteredRooms.length === 0 ? (
                    <p>No rooms reserved.</p>
                ) : (
                    <ul>
                        {filteredRooms.map(room => (
                            <li key={room.id}>
                                {room.first_name} {room.last_name} - Room {room.room_number} - Check-out: {room.check_out_date}
                                <button onClick={() => handleCheckOut(room.id)} disabled={loading}>
                                    {loading ? 'Checking Out...' : 'Check Out'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default Reservation;
