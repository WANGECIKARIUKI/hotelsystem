import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './addcategory.css';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [vat, setVat] = useState('');
    const [isDelivery, setIsDelivery] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Fetch the parent categories for the dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/categories', {
                name: categoryName,
                parent_category: parentCategory,
                vat,
                delivery: isDelivery,
                delivery_fee: isDelivery ? deliveryFee : 0,
            });
            navigate('/categories'); // Navigate back to categories
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    return (
        <div>
            <h1>Add Category</h1>
            <form onSubmit={handleSubmit}>
                <label>Category Name:</label>
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />
                
                <label>Sub Category:</label>
                <select
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                >
                    <option value="">Select Sub Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label>VAT (%):</label>
                <input
                    type="number"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    required
                />

                <label>
                    <input
                        type="checkbox"
                        
                        checked={isDelivery}
                        onChange={(e) => setIsDelivery(e.target.checked)}
                    />
                    Delivery
                </label>

                {isDelivery && (
                    <div>
                        <label>Delivery Fee:</label>
                        <input
                            type="number"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => navigate('/categories')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
