import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addorder.css';

const AddOrder = () => {
    const [orderType, setOrderType] = useState('');
    const [guest, setGuest] = useState(null);
    const [guestSearch, setGuestSearch] = useState('');
    const [items, setItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [immediatePayment, setImmediatePayment] = useState(false);
    const [itemSearch, setItemSearch] = useState('');
    const [allItems, setAllItems] = useState([]);
    const [extras, setExtras] = useState([]);

    // Fetch all available items (e.g., Room Services, Spa, etc.)
    useEffect(() => {
        const fetchItems = async () => {
            const response = await axios.get('/items'); // Endpoint to fetch items
            setAllItems(response.data);
        };

        fetchItems();
    }, []);

    // Handle radio button changes
    const handleRadioChange = (e) => {
        setOrderType(e.target.value);
    };

    // Fetch guests when searching for a guest
    const handleSearchGuest = async () => {
        if (guestSearch) {
            const response = await axios.get(`/guests/search?query=${guestSearch}`);
            setGuest(response.data);
        }
    };

    // Add an item to the order
    const handleAddItem = (item) => {
        setItems([...items, { ...item, quantity, subtotal: item.price * quantity }]);
        calculateTotal();
    };

    // Calculate total amount
    const calculateTotal = () => {
        const itemTotal = items.reduce((acc, item) => acc + item.subtotal, 0);
        const total = itemTotal - (itemTotal * (discount / 100)) + deliveryFee;
        setTotalAmount(total);
    };

    // Handle quantity change
    const handleQuantityChange = (itemId, change) => {
        setItems(items.map((item) =>
            item.id === itemId ? { 
                ...item, 
                quantity: Math.max(1, item.quantity + change),
                subtotal: (item.price * (Math.max(1, item.quantity + change))) 
            } : item
        ));
        calculateTotal();
    };

    // Add extra to item
    const handleAddExtra = (itemId, extra) => {
        setItems(items.map((item) => {
            if (item.id === itemId) {
                return {
                    ...item,
                    extras: [...item.extras, extra],
                    subtotal: item.subtotal + extra.price
                };
            }
            return item;
        }));
        calculateTotal();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            guest,
            items,
            discount,
            deliveryFee,
            totalAmount,
            notes,
            immediatePayment,
            paymentMethod,
        };

        await axios.post('/orders', orderData);
        window.location.href = '/orders';  // Redirect after successful order creation
    };

    useEffect(() => {
        calculateTotal();  // Recalculate total when items, discount, or delivery fee change
    }, [items, discount, deliveryFee]);

    return (
        <div className="add-order-page">
            <h1>Add Order</h1>
            <form onSubmit={handleSubmit}>
                
                {/* Order Type Selection */}
                <section className="order-type-section">
                    <h3>Order Type</h3>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="orderType"
                                value="search"
                                checked={orderType === 'search'}
                                onChange={handleRadioChange}
                            />
                            Search Guest
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="orderType"
                                value="create"
                                checked={orderType === 'create'}
                                onChange={handleRadioChange}
                            />
                            Create Guest
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="orderType"
                                value="without"
                                checked={orderType === 'without'}
                                onChange={handleRadioChange}
                            />
                            Without Guest
                        </label>
                    </div>
                </section>

                {/* Guest Search Section */}
            {orderType === 'search' && (
               <section className="guest-search-section">
                 <h3>Search Guest</h3>
                <div className="input-row">
                  <label>Search Guest:</label>
                         <input
                type="text"
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                placeholder="Enter guest name or email"
            />
            <button type="button" onClick={handleSearchGuest}>Search</button>
        </div>

        {guest && (
            <div>
                <h4>Guest Details</h4>
                <p>Name: {guest.name}</p>
                <p>Email: {guest.email}</p>
            </div>
        )}

        <div className="input-row">
            <label>Delivery To:</label>
            <select>
                <option value="room">Room</option>
                <option value="without">Without Delivery</option>
            </select>

            <label>Delivery Date & Time:</label>
            <input type="datetime-local" />
        </div>

        {/* Search Service */}
        <section className="search-service-section">
            <h3>Search Service</h3>
            <div className="input-row">
                <label>Search Service:</label>
                <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    placeholder="Search service (e.g., VIP Services, Room Services)"
                />
            </div>

            {/* Item Search Result */}
            <div className="items-search-results">
                {allItems
                    .filter(item => item.name.toLowerCase().includes(itemSearch.toLowerCase()))
                    .map(item => (
                        <div key={item.id} className="item-card">
                            <img src={item.imageUrl} alt={item.name} />
                            <h4>{item.name}</h4>
                            <button onClick={() => handleAddItem(item)}>Add</button>
                        </div>
                    ))}
            </div>

            {/* Items List */}
            <div className="items-list">
                {items.map((item, index) => (
                    <div key={index} className="item-list-card">
                        <span>{item.name}</span>
                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                        <span>${item.price}</span>
                        <span>Subtotal: ${item.subtotal}</span>
                        <button onClick={() => setItems(items.filter(i => i.id !== item.id))}>Delete</button>
                        <button onClick={() => setExtras(item.extras)}>Add Extras</button>
                    </div>
                ))}
            </div>
        </section>
    </section>
)}

{/* Create Guest Section */}
{orderType === 'create' && (
    <section className="create-guest-section">
        <h3>Create New Guest</h3>
        <div className="input-row">
            <label>First Name:</label>
            <input type="text" />
            <label>Last Name:</label>
            <input type="text" />
        </div>
        <div className="input-row">
            <label>Phone Number:</label>
            <input type="text" />
            <label>Email:</label>
            <input type="email" />
        </div>
        <div className="input-row">
            <label>ID Number:</label>
            <input type="text" />
            <label>ID Type:</label>
            <select>
                <option value="passport">Passport</option>
                <option value="id_card">ID Card</option>
            </select>
        </div>
        <div className="input-row">
            <label>Date of Birth:</label>
            <input type="date" />
            <label>Country:</label>
            <input type="text" />
        </div>
        <div className="input-row">
            <label>Zipcode:</label>
            <input type="text" />
            <label>Address:</label>
            <input type="text" />
        </div>
        <div className="input-row">
            <label>Language:</label>
            <input type="text" />
            <label>Delivery To:</label>
            <select>
                <option value="room">Room</option>
                <option value="without">Without Delivery</option>
            </select>
        </div>
        <div className="input-row">
            <label>Delivery Date & Time:</label>
            <input type="datetime-local" />
            <label>Child:</label>
            <input type="checkbox" />
        </div>

        {/* Search Service */}
        <section className="search-service-section">
            <h3>Search Service</h3>
            <div className="input-row">
                <label>Search Service:</label>
                <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    placeholder="Search service (e.g., VIP Services, Room Services)"
                />
            </div>

            {/* Item Search Result */}
            <div className="items-search-results">
                {allItems
                    .filter(item => item.name.toLowerCase().includes(itemSearch.toLowerCase()))
                    .map(item => (
                        <div key={item.id} className="item-card">
                            <img src={item.imageUrl} alt={item.name} />
                            <h4>{item.name}</h4>
                            <button onClick={() => handleAddItem(item)}>Add</button>
                        </div>
                    ))}
            </div>

            {/* Items List */}
            <div className="items-list">
                {items.map((item, index) => (
                    <div key={index} className="item-list-card">
                        <span>{item.name}</span>
                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                        <span>${item.price}</span>
                        <span>Subtotal: ${item.subtotal}</span>
                        <button onClick={() => setItems(items.filter(i => i.id !== item.id))}>Delete</button>
                        <button onClick={() => setExtras(item.extras)}>Add Extras</button>
                    </div>
                ))}
            </div>
        </section>
    </section>
)}


                {/* Order Summary */}
                <section className="order-summary-section">
                    <h3>Order Summary</h3>
                    <div className="input-row">
                        <label>Discount (%):</label>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                    </div>
                    <div className="input-row">
                        <label>Delivery Fee:</label>
                        <input
                            type="number"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(e.target.value)}
                        />
                    </div>
                    <h3>Total Amount: ${totalAmount}</h3>
                </section>

                {/* Additional Information */}
                <section className="additional-info-section">
                    <h3>Additional Information</h3>
                    <div className="input-row">
                        <label>Notes:</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className="input-row">
                        <label>Immediate Payment:</label>
                        <input
                            type="checkbox"
                            checked={immediatePayment}
                            onChange={(e) => setImmediatePayment(e.target.checked)}
                        />
                    </div>
                    <div className="input-row">
                        <label>Payment Method:</label>
                        <select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                            <option value="cash">Cash</option>
                            <option value="credit">Credit Card</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>
                </section>

                {/* Action Buttons */}
                <div>
                    <button type="button" onClick={() => window.location.href = '/orders'}>Cancel</button>
                    <button type="submit">Add Order</button>
                </div>
            </form>
        </div>
    );
};

export default AddOrder;
