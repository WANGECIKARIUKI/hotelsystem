import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './services.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [types, setTypes] = useState(['Default', 'Voucher']);
    const [filter, setFilter] = useState({ search: '', category: '', type: '', status: 'all' });
    const [currentPage, setCurrentPage] = useState(1);
    const [servicesPerPage] = useState(10);  // Number of services per page
    const navigate = useNavigate();

    // Dummy data for services, categories, and departments
    const dummyServices = [
        { id: 1, name: 'Service A', category: 'Category 1', type: 'Default', department: 'Dept 1', quantity: '10', vat: 5, price: 100, status: true },
        { id: 2, name: 'Service B', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '5', vat: 10, price: 200, status: true },
        { id: 3, name: 'Service C', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 15, price: 150, status: false },
        { id: 4, name: 'Service D', category: 'Category 3', type: 'Default', department: 'Dept 1', quantity: '20', vat: 5, price: 120, status: true },
        { id: 5, name: 'Service E', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '10', vat: 8, price: 180, status: false },
        { id: 6, name: 'Service F', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 10, price: 200, status: true },
        { id: 1, name: 'Service A', category: 'Category 1', type: 'Default', department: 'Dept 1', quantity: '10', vat: 5, price: 100, status: true },
        { id: 2, name: 'Service B', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '5', vat: 10, price: 200, status: true },
        { id: 3, name: 'Service C', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 15, price: 150, status: false },
        { id: 4, name: 'Service D', category: 'Category 3', type: 'Default', department: 'Dept 1', quantity: '20', vat: 5, price: 120, status: true },
        { id: 5, name: 'Service E', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '10', vat: 8, price: 180, status: false },
        { id: 6, name: 'Service F', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 10, price: 200, status: true },
        { id: 1, name: 'Service A', category: 'Category 1', type: 'Default', department: 'Dept 1', quantity: '10', vat: 5, price: 100, status: true },
        { id: 2, name: 'Service B', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '5', vat: 10, price: 200, status: true },
        { id: 3, name: 'Service C', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 15, price: 150, status: false },
        { id: 4, name: 'Service D', category: 'Category 3', type: 'Default', department: 'Dept 1', quantity: '20', vat: 5, price: 120, status: true },
        { id: 5, name: 'Service E', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '10', vat: 8, price: 180, status: false },
        { id: 6, name: 'Service F', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 10, price: 200, status: true },
        { id: 1, name: 'Service A', category: 'Category 1', type: 'Default', department: 'Dept 1', quantity: '10', vat: 5, price: 100, status: true },
        { id: 2, name: 'Service B', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '5', vat: 10, price: 200, status: true },
        { id: 3, name: 'Service C', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 15, price: 150, status: false },
        { id: 4, name: 'Service D', category: 'Category 3', type: 'Default', department: 'Dept 1', quantity: '20', vat: 5, price: 120, status: true },
        { id: 5, name: 'Service E', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '10', vat: 8, price: 180, status: false },
        { id: 6, name: 'Service F', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 10, price: 200, status: true },
        { id: 1, name: 'Service A', category: 'Category 1', type: 'Default', department: 'Dept 1', quantity: '10', vat: 5, price: 100, status: true },
        { id: 2, name: 'Service B', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '5', vat: 10, price: 200, status: true },
        { id: 3, name: 'Service C', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 15, price: 150, status: false },
        { id: 4, name: 'Service D', category: 'Category 3', type: 'Default', department: 'Dept 1', quantity: '20', vat: 5, price: 120, status: true },
        { id: 5, name: 'Service E', category: 'Category 2', type: 'Voucher', department: 'Dept 2', quantity: '10', vat: 8, price: 180, status: false },
        { id: 6, name: 'Service F', category: 'Category 1', type: 'Voucher', department: 'Dept 3', quantity: 'Unlimited', vat: 10, price: 200, status: true },
    ];

    const dummyCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
    ];

    const dummyDepartments = [
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
        { id: 1, name: 'Dept 1' },
        { id: 2, name: 'Dept 2' },
        { id: 3, name: 'Dept 3' },
    ];

    // Fetch data from API
    const fetchServices = async () => {
        try {
            const response = await axios.get('/services');
            setServices(response.data);
        } catch (error) {
            console.log("Error fetching services, using dummy data:", error);
            setServices(dummyServices);  // Use dummy data if API fetch fails
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.log("Error fetching categories, using dummy data:", error);
            setCategories(dummyCategories);  // Use dummy data if API fetch fails
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.log("Error fetching departments, using dummy data:", error);
            setDepartments(dummyDepartments);  // Use dummy data if API fetch fails
        }
    };

    useEffect(() => {
        fetchServices();
        fetchCategories();
        fetchDepartments();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    const toggleStatus = (id, currentStatus) => {
        const updatedServices = services.map((service) => {
            if (service.id === id) {
                return { ...service, status: !currentStatus };
            }
            return service;
        });
        setServices(updatedServices);
    };

    const filteredServices = services.filter(service => {
        return (
            (filter.search === '' || service.name.toLowerCase().includes(filter.search.toLowerCase())) &&
            (filter.category === '' || service.category === filter.category) &&
            (filter.type === '' || service.type === filter.type) &&
            (filter.status === 'all' || (filter.status === 'active' ? service.status : !service.status))
        );
    });

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Services</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search..."
                    name="search"
                    value={filter.search}
                    onChange={handleFilterChange}
                />
                <select name="category" value={filter.category} onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                </select>
                <select name="type" value={filter.type} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <button onClick={() => navigate('/createservice')}>Create Service</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Department</th>
                        <th>Quantity</th>
                        <th>VAT</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentServices.map(service => (
                        <tr key={service.id}>
                            <td>{service.name}</td>
                            <td>{service.category}</td>
                            <td>{service.type}</td>
                            <td>{service.department}</td>
                            <td>{service.quantity || 'Unlimited'}</td>
                            <td>{service.vat}%</td>
                            <td>${service.price}</td>
                            <td>
                                {/* Custom toggle slider */}
                                <div
                                    className={`status-toggle ${service.status ? 'active' : 'inactive'}`}
                                    onClick={() => toggleStatus(service.id, service.status)}
                                >
                                    <div className="slider">
                                        {service.status ? '✅' : '❌'}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={{ marginTop: '20px', textAlign: 'end', color: 'blue'}}>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredServices.length / servicesPerPage)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Services;
