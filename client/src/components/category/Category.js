import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './category.css';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter(category =>
            category.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCategories(filtered);
        setCurrentPage(1); // Reset to first page when search changes
    }, [search, categories]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);

            // Dummy data fallback
            const dummyData = [
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
                {
                    id: 1,
                    name: 'Electronics',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 10,
                    service_count: 25,
                    order_count: 100,
                    vat: 12,
                },
                {
                    id: 2,
                    name: 'Home Services',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 8,
                    service_count: 20,
                    order_count: 50,
                    vat: 10,
                },
                {
                    id: 3,
                    name: 'Health & Wellness',
                    image_url: 'https://via.placeholder.com/50',
                    subcategory_count: 5,
                    service_count: 15,
                    order_count: 30,
                    vat: 8,
                },
            ];

            setCategories(dummyData);
            setFilteredCategories(dummyData);
        }
    };

    // Pagination logic
    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <h1>Service Categories</h1>
            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => window.location.href = '/addcategory'}>Add Category</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Category Name</th>
                        <th>Subcategories</th>
                        <th>Services</th>
                        <th>Orders</th>
                        <th>VAT (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.map(category => (
                        <tr key={category.id}>
                            <td>
                                {category.image_url ? (
                                    <img src={category.image_url} alt={category.name} className="category-image" />
                                ) : (
                                    'No Image'
                                )}
                            </td>
                            <td>{category.name}</td>
                            <td>{category.subcategory_count}</td>
                            <td>{category.service_count}</td>
                            <td>{category.order_count}</td>
                            <td>{category.vat}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredCategories.length / itemsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Category;
