import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Guestmanagement.css';
import { jsPDF } from 'jspdf';

function Guestmanagement() {
    const [guests, setGuests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [guestsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/guests')
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(data => setGuests(data))
            .catch(() => {
                // Dummy data for fallback
                setGuests([
                    {
                        id: 1,
                        created_at: '2024-01-01T00:00:00Z',
                        first_name: 'John',
                        last_name: 'Doe',
                        date_of_birth: '1990-05-15T00:00:00Z',
                        num_bookings: 5,
                        address: '123 Main St, Cityville',
                        nationality: 'American',
                        email: 'johndoe@example.com'
                    },
                    {
                        id: 1,
                        created_at: '2024-01-01T00:00:00Z',
                        first_name: 'John',
                        last_name: 'Doe',
                        date_of_birth: '1990-05-15T00:00:00Z',
                        num_bookings: 5,
                        address: '123 Main St, Cityville',
                        nationality: 'American',
                        email: 'johndoe@example.com'
                    },
                    {
                        id: 1,
                        created_at: '2024-01-01T00:00:00Z',
                        first_name: 'John',
                        last_name: 'Doe',
                        date_of_birth: '1990-05-15T00:00:00Z',
                        num_bookings: 5,
                        address: '123 Main St, Cityville',
                        nationality: 'American',
                        email: 'johndoe@example.com'
                    },
                    {
                        id: 2,
                        created_at: '2024-02-10T00:00:00Z',
                        first_name: 'Jane',
                        last_name: 'Smith',
                        date_of_birth: '1985-08-20T00:00:00Z',
                        num_bookings: 2,
                        address: '456 Elm St, Townsville',
                        nationality: 'British',
                        email: 'janesmith@example.com'
                    },
                    {
                        id: 3,
                        created_at: '2024-03-05T00:00:00Z',
                        first_name: 'Alice',
                        last_name: 'Johnson',
                        date_of_birth: '1992-11-30T00:00:00Z',
                        num_bookings: 1,
                        address: '789 Oak St, Villageton',
                        nationality: 'Canadian',
                        email: 'alicejohnson@example.com'
                    },
                    {
                        id: 4,
                        created_at: '2024-03-18T00:00:00Z',
                        first_name: 'Robert',
                        last_name: 'Brown',
                        date_of_birth: '1988-09-12T00:00:00Z',
                        num_bookings: 3,
                        address: '321 Pine St, Metropolis',
                        nationality: 'Australian',
                        email: 'robertbrown@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 1,
                        created_at: '2024-01-01T00:00:00Z',
                        first_name: 'John',
                        last_name: 'Doe',
                        date_of_birth: '1990-05-15T00:00:00Z',
                        num_bookings: 5,
                        address: '123 Main St, Cityville',
                        nationality: 'American',
                        email: 'johndoe@example.com'
                    },
                    {
                        id: 2,
                        created_at: '2024-02-10T00:00:00Z',
                        first_name: 'Jane',
                        last_name: 'Smith',
                        date_of_birth: '1985-08-20T00:00:00Z',
                        num_bookings: 2,
                        address: '456 Elm St, Townsville',
                        nationality: 'British',
                        email: 'janesmith@example.com'
                    },
                    {
                        id: 3,
                        created_at: '2024-03-05T00:00:00Z',
                        first_name: 'Alice',
                        last_name: 'Johnson',
                        date_of_birth: '1992-11-30T00:00:00Z',
                        num_bookings: 1,
                        address: '789 Oak St, Villageton',
                        nationality: 'Canadian',
                        email: 'alicejohnson@example.com'
                    },
                    {
                        id: 4,
                        created_at: '2024-03-18T00:00:00Z',
                        first_name: 'Robert',
                        last_name: 'Brown',
                        date_of_birth: '1988-09-12T00:00:00Z',
                        num_bookings: 3,
                        address: '321 Pine St, Metropolis',
                        nationality: 'Australian',
                        email: 'robertbrown@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    },
                    {
                        id: 5,
                        created_at: '2024-04-25T00:00:00Z',
                        first_name: 'Emily',
                        last_name: 'Clark',
                        date_of_birth: '1995-07-19T00:00:00Z',
                        num_bookings: 4,
                        address: '654 Cedar Ave, Uptown',
                        nationality: 'New Zealander',
                        email: 'emilyclark@example.com'
                    }
                ]);  // Your dummy data goes here
            });
    }, []);

    const handleAddGuest = () => {
        navigate('/guestform');
    };

    const handleViewGuest = (guest) => {
        // Show detailed view of the guest
        alert(`Viewing details for ${guest.first_name} ${guest.last_name}`);
    };

    const handleGenerateInvoice = (guest) => {
        const doc = new jsPDF();
        doc.text(`Invoice for ${guest.first_name} ${guest.last_name}`, 10, 10);
        doc.text(`Total Charges: $${guest.total_charges}`, 10, 20);
        doc.text(`Amount Paid: $${guest.amount_paid}`, 10, 30);
        doc.text(`Pending Balance: $${guest.pending_balance}`, 10, 40);
        doc.save(`${guest.first_name}_${guest.last_name}_Invoice.pdf`);
    };

    const handleGenerateReceipt = (guest) => {
        const doc = new jsPDF();
        doc.text(`Receipt for ${guest.first_name} ${guest.last_name}`, 10, 10);
        doc.text(`Total Paid: $${guest.amount_paid}`, 10, 20);
        doc.save(`${guest.first_name}_${guest.last_name}_Receipt.pdf`);
    };

    const handleEditPayment = (guest) => {
        // Update guest's payment status and set balance to 0
        const updatedGuest = { ...guest, pending_balance: 0, amount_paid: guest.total_charges };
        setGuests(prevGuests => prevGuests.map(g => g.id === guest.id ? updatedGuest : g));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter guests by search query
    const filteredGuests = guests.filter(guest =>
        guest.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.last_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastGuest = currentPage * guestsPerPage;
    const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
    const currentGuests = filteredGuests.slice(indexOfFirstGuest, indexOfLastGuest);
    const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

    return (
        <div className="guest-management">
            <h1>Guest Management</h1>
            <button onClick={handleAddGuest} className="add-guest-button">Add Guest</button>
            <input
                type="text"
                placeholder="Search by guest name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
            />

            <table className="guest-table">
                <thead>
                    <tr>
                        <th>Date of Creation</th>
                        <th>Full Name</th>
                        <th>Date of Birth</th>
                        <th>Number of Bookings</th>
                        <th>Address</th>
                        <th>Nationality</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentGuests.map(guest => (
                        <tr key={guest.id}>
                            <td>{new Date(guest.created_at).toLocaleDateString()}</td>
                            <td>{guest.first_name} {guest.last_name}</td>
                            <td>{new Date(guest.date_of_birth).toLocaleDateString()}</td>
                            <td>{guest.num_bookings}</td>
                            <td>{guest.address}</td>
                            <td>{guest.nationality}</td>
                            <td>{guest.email}</td>
                            <td>
                                <div className="dropdown">
                                    <button className="dropdown-btn">...</button>
                                    <div className="dropdown-content">
                                        <button onClick={() => handleViewGuest(guest)}>View</button>
                                        <button onClick={() => handleGenerateInvoice(guest)}>Invoice</button>
                                        <button onClick={() => handleGenerateReceipt(guest)}>Receipt</button>
                                        <button onClick={() => handleEditPayment(guest)}>Edit Payment</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody> 
            </table>

            <div className="pagination">
                {currentPage > 1 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)}>&laquo; Prev</button>
                )}
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button onClick={() => setCurrentPage(currentPage + 1)}>Next &raquo;</button>
                )}
            </div>
        </div>
    );
}

export default Guestmanagement;
