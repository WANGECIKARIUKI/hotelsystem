import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineCheckCircle } from 'react-icons/ai';

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
        fetchReservedRooms();
    }, []);

    useEffect(() => {
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
                setErrorMessage('');
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

    const inputStyle = {
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "14px",
        marginBottom: "15px",
        justifyContent: "center",
        textAlign: "center"
    };

    const buttonStyle = {
        padding: "12px 24px",
        background: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        width: "40%"
    };

    const sectionStyle = {
        marginBottom: "40px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)"
    };

    const labelStyle = {
        textAlign: "left", 
        marginBottom: "5px", 
        fontWeight: "bold", 
        display: "block"
    };

    return (
        <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif", textAlign: 'center' }}>
            {errorMessage && <p style={{ color: 'red', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>{errorMessage}</p>}

            {/* Reservation Form */}
            <div style={sectionStyle}>
                <form onSubmit={handleSubmit}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>Room Information</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <label htmlFor="room_type" style={labelStyle}>Room Type:</label>
                        <input type="text" id="room_type" name="room_type" onChange={handleChange} required style={inputStyle} />
                        
                        <label htmlFor="room_number" style={labelStyle}>Room Number:</label>
                        <input type="text" id="room_number" name="room_number" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="check_in_date" style={labelStyle}>Check-in Date:</label>
                        <input type="date" id="check_in_date" name="check_in_date" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="check_out_date" style={labelStyle}>Check-out Date:</label>
                        <input type="date" id="check_out_date" name="check_out_date" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="no_of_rooms" style={labelStyle}>No. of Rooms:</label>
                        <input type="number" id="no_of_rooms" name="no_of_rooms" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="no_of_children" style={labelStyle}>No. of Children:</label>
                        <input type="number" id="no_of_children" name="no_of_children" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="no_of_adults" style={labelStyle}>No. of Adults:</label>
                        <input type="number" id="no_of_adults" name="no_of_adults" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="amount" style={labelStyle}>Amount to be Charged:</label>
                        <input type="text" id="amount" name="amount" value={formData.amount} readOnly style={{ ...inputStyle, background: "#f4f4f4" }} />
                    </div>

                    {/* Customer Information Section */}
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>Customer Information</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                        <label htmlFor="first_name" style={labelStyle}>First Name:</label>
                        <input type="text" id="first_name" name="first_name" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="last_name" style={labelStyle}>Last Name:</label>
                        <input type="text" id="last_name" name="last_name" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="email" style={labelStyle}>Email:</label>
                        <input type="email" id="email" name="email" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="home_address" style={labelStyle}>Home Address:</label>
                        <input type="text" id="home_address" name="home_address" onChange={handleChange} required style={inputStyle} />

                        <label htmlFor="telephone" style={labelStyle}>Phone Number:</label>
                        <input type="text" id="telephone" name="telephone" onChange={handleChange} required style={inputStyle} />
                    </div>

                    <button type="submit" style={buttonStyle}>
                        {loading ? 'Booking...' : 'Book Now'}
                    </button>
                </form>
            </div>

            {showPopup && (
                <div className="popup">
                    <AiOutlineCheckCircle size={48} color="green" />
                    <h2>Reservation Successful!</h2>
                    <button onClick={() => setShowPopup(false)} style={buttonStyle}>Close</button>
                </div>
            )}

            {/* Search & Reservation History Section */}
            <div style={sectionStyle}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>Search Reservations</h2>
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search by Name or Room Number"
                    style={{ width: '60%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '20px' }}
                />
                <div>
                    {filteredRooms.length ? (
                        <ul>
                            {filteredRooms.map(room => (
                                <li key={room.id}>
                                    {room.first_name} {room.last_name} - Room {room.room_number}
                                    <button onClick={() => handleCheckOut(room.id)} style={{ marginLeft: '10px', padding: '8px', background: '#FF6347', color: '#fff', borderRadius: '8px' }}>
                                        Check-out
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reservations found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reservation;
