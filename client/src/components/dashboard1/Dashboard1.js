import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const socket = io('http://localhost:5000'); // Connect to the backend WebSocket server

function Dashboard1() {
    const [data, setData] = useState({
        total_rooms: 120,
        total_reservations: 85,
        number_of_staff: 20,
        booked_rooms: 75,
        available_rooms: 45,
        checked_in_clients: 30,
        checkouts_today: 10,
        pending_payments: 50000,
        total_revenue: 200000,
    });

    useEffect(() => {
        // Fetch initial data from the server
        axios.get('http://localhost:5000/dashboard', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(response => {
            setData(response.data);
        }).catch(error => console.log(error));

        // Listen for real-time updates from the server
        socket.on('dashboard_update', (updatedData) => {
            setData(updatedData); // Update state with new data
        });

        // Clean up socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const metrics = [
        { id: "total-rooms", label: "Total Rooms", value: data.total_rooms, icon: "fas fa-hotel", color: "#4CAF50" },
        { id: "reservations", label: "Reservations", value: data.total_reservations, icon: "fas fa-calendar-check", color: "#2196F3" },
        { id: "staff", label: "Staff", value: data.number_of_staff, icon: "fas fa-users", color: "#FF5722" },
        { id: "booked-rooms", label: "Booked Rooms", value: data.booked_rooms, icon: "fas fa-bed", color: "#9C27B0" },
        { id: "available-rooms", label: "Available Rooms", value: data.available_rooms, icon: "fas fa-door-open", color: "#FFC107" },
        { id: "checked-in", label: "Checked In", value: data.checked_in_clients, icon: "fas fa-sign-in-alt", color: "#673AB7" },
        { id: "checkouts", label: "Checkouts Today", value: data.checkouts_today, icon: "fas fa-sign-out-alt", color: "#FF9800" },
        { id: "pending-payments", label: "Pending Payments", value: `$${data.pending_payments.toLocaleString()}`, icon: "fas fa-dollar-sign", color: "#F44336" },
        { id: "revenue", label: "Total Revenue", value: `$${data.total_revenue.toLocaleString()}`, icon: "fas fa-dollar-sign", color: "#00BCD4" },
    ];

    return (
        <div className="dashboard1">
            {metrics.map((metric) => (
                <div className="card" key={metric.id}>
                    <i className={`${metric.icon} card-icon`} style={{ color: metric.color }}></i>
                    <h2 style={{ color: 'white' }}>{metric.value}</h2>
                    <p>{metric.label}</p>
                </div>
            ))}
        </div>
    );
}

export default Dashboard1;
