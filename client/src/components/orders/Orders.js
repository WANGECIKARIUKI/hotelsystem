import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orders.css'; // Make sure to import the CSS

import { FaCheckCircle, FaMoneyBillWave, FaChartLine, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({
        totalOrders: 0,
        completedOrders: 0,
        revenue: 0,
        paid: 0,
        lostAmount: 0,
    });
    const [servicesToConfirm, setServicesToConfirm] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        createdOn: '',
        dueDate: '',
        guest: '',
        category: '',
        status: '',
    });


    useEffect(() => {
        fetchOrders();
        fetchSummary();
        fetchServicesToConfirm();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
                { id: 1, guest_name: 'John Doe', service_name: 'Cleaning', amount: 50, status: 'confirmed', time: '2024-11-12', delivery_status: 'Delivered', extras: 'None', paid_status: 'paid' },
                { id: 2, guest_name: 'Jane Smith', service_name: 'Room Service', amount: 30, status: 'completed', time: '2024-11-13', delivery_status: 'Pending', extras: 'Extra towels', paid_status: 'unpaid' },
            ]);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await axios.get('/orders/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
            setSummary({
                totalOrders: 100,
                completedOrders: 75,
                revenue: 5000,
                paid: 4500,
                lostAmount: 500,
            });
        }
    };

    const fetchServicesToConfirm = async () => {
        try {
            const response = await axios.get('/orders/services-to-confirm');
            setServicesToConfirm(response.data);
        } catch (error) {
            console.error('Error fetching services to confirm:', error);
            setServicesToConfirm([
                { id: 1, orderDate: '2024-11-10', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Vacuum Cleaner' },
                { id: 2, orderDate: '2024-11-11', delivery: 'Completed', imageUrl: 'https://via.placeholder.com/150', itemName: 'Air Purifier' },
                { id: 3, orderDate: '2024-11-12', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Washing Machine' },
                { id: 1, orderDate: '2024-11-10', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Vacuum Cleaner' },
                { id: 2, orderDate: '2024-11-11', delivery: 'Completed', imageUrl: 'https://via.placeholder.com/150', itemName: 'Air Purifier' },
                { id: 3, orderDate: '2024-11-12', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Washing Machine' },
                { id: 1, orderDate: '2024-11-10', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Vacuum Cleaner' },
                { id: 2, orderDate: '2024-11-11', delivery: 'Completed', imageUrl: 'https://via.placeholder.com/150', itemName: 'Air Purifier' },
                { id: 3, orderDate: '2024-11-12', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Washing Machine' },
                { id: 1, orderDate: '2024-11-10', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Vacuum Cleaner' },
                { id: 2, orderDate: '2024-11-11', delivery: 'Completed', imageUrl: 'https://via.placeholder.com/150', itemName: 'Air Purifier' },
                { id: 3, orderDate: '2024-11-12', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Washing Machine' },
                { id: 1, orderDate: '2024-11-10', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Vacuum Cleaner' },
                { id: 2, orderDate: '2024-11-11', delivery: 'Completed', imageUrl: 'https://via.placeholder.com/150', itemName: 'Air Purifier' },
                { id: 3, orderDate: '2024-11-12', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Washing Machine' },
                { id: 1, orderDate: '2024-11-10', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Vacuum Cleaner' },
                { id: 2, orderDate: '2024-11-11', delivery: 'Completed', imageUrl: 'https://via.placeholder.com/150', itemName: 'Air Purifier' },
                { id: 3, orderDate: '2024-11-12', delivery: 'Pending', imageUrl: 'https://via.placeholder.com/150', itemName: 'Washing Machine' },
            ]);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (e, orderId, field) => {
        const { value } = e.target;
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, [field]: value } : order
            )
        );
       /* console.log(Updated Order ${orderId}:, { [field]: value });*/
    };

    const filteredOrders = orders.filter((order) => {
        return (
            (filters.search === '' || order.guest_name.toLowerCase().includes(filters.search.toLowerCase())) &&
            (filters.category === '' || order.category === filters.category) &&
            (filters.status === '' || order.status === filters.status)
        );
    });

    const handleConfirmService = (id) => {
        console.log('Confirmed service with id:', id);
    };

    const handleDeclineService = (id) => {
        console.log('Declined service with id:', id);
    };

    const handleConfirmAll = () => {
        console.log('Confirmed all services');
    };

    return (
        <div className="orders-container">
            <h1>Orders</h1>

            {/* Add Order Button */}
            <button onClick={() => window.location.href = '/addorder'}>Add Order</button>

            {/* Summary Cards Section with Icons */}
            <div className="summary-cards">
                <div className="cards">
                    <FaCheckCircle style={{ color: 'coral' }} /> Total Orders: {summary.totalOrders}
                </div>
                <div className="cards">
                    <FaChartLine style={{ color: 'purple' }} /> Completed Orders: {summary.completedOrders}
                </div>
                <div className="cards">
                    <FaMoneyBillWave style={{ color: 'yellow' }} /> Revenue: ${summary.revenue}
                </div>
                <div className="cards">
                    <FaCheckCircle style={{ color: 'violet' }} /> Paid: ${summary.paid}
                </div>
                <div className="cards">
                    <FaTimesCircle style={{ color: 'green' }} /> Lost Amount: ${summary.lostAmount}
                </div>
            </div>

            {/* Services to Confirm Section */}
            <div className="services-to-confirm">
                <h2>Services to Confirm</h2>
                <button onClick={handleConfirmAll}>Confirm All Services</button>
                <div className="service-cards">
                    {servicesToConfirm.map((service) => (
                        <div key={service.id} className="service-card">
                            <img src={service.imageUrl} alt={service.itemName} className="service-image" />
                            <p>Item: {service.itemName}</p>
                            <p>Order Date: {service.orderDate}</p>
                            <p>Delivery: {service.delivery}</p>
                            <button onClick={() => handleConfirmService(service.id)}>Confirm</button>
                            <button style = {{backgroundColor: 'red'}}onClick={() => handleDeclineService(service.id)}>Decline</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <h3>Filter Orders</h3>
                <input
                    type="text"
                    name="search"
                    placeholder="Search by guest name..."
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="createdOn"
                    value={filters.createdOn}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="dueDate"
                    value={filters.dueDate}
                    onChange={handleFilterChange}
                />
                <select name="guest" value={filters.guest} onChange={handleFilterChange}>
                    <option value="">All Guests</option>
                </select>
                <select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                </select>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Guest Name</th>
                        <th>Service Name</th>
                        <th>Delivery Status</th>
                        <th>Amount</th>
                        <th>Extras</th>
                        <th>Paid Status</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.time}</td>
                            <td>{order.guest_name || 'N/A'}</td>
                            <td>{order.service_name}</td>
                            <td>{order.delivery_status}</td>
                            <td>${order.amount}</td>
                            <td>{order.extras}</td>
                            <td>
                                <select
                                    value={order.paid_status}
                                    onChange={(e) => handleDropdownChange(e, order.id, 'paid_status')}
                                    className="status-dropdown"
                                >
                                    <option value="paid">Paid</option>
                                    <option value="partially_paid">Partially Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleDropdownChange(e, order.id, 'status')}
                                    className="status-dropdown"
                                >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;