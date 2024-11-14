import React, { useState, useEffect } from 'react';
import './guest.css';
import { countries } from '../../assets/data/countries';
import 'flag-icons/css/flag-icons.min.css';

function Guestform({ onSave }) {
    const [guestData, setGuestData] = useState({
        first_name: '',
        last_name: '',
        nationality: '',
        language: '',
        date_of_birth: '',
        phone_number: '',
        phone_code: '+1',
        email: '',
        country: '',
        region: '',
        city: '',
        address: '',
        zip_code: '',
        id_card_type: '',
        id_card_number: '',
        amount: 0,
        paid_amount: 0,
        pending_amount: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuestData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Calculate pending amount whenever amount or paid_amount changes
    useEffect(() => {
        setGuestData(prevState => ({
            ...prevState,
            pending_amount: Math.max(prevState.amount - prevState.paid_amount, 0)
        }));
    }, [guestData.amount, guestData.paid_amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/add_guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guestData),
            });
            if (response.ok) {
                onSave();
            } else {
                console.error("Failed to save guest data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="guest-form">
            {/* General Information Section */}
            <section className="form-section">
                <div className="section-container">
                    <h2 className="section-heading">General Information</h2>
                    <label>
                        First Name:
                        <input type="text" name="first_name" value={guestData.first_name} onChange={handleChange} className="large-input" required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="last_name" value={guestData.last_name} onChange={handleChange} className="large-input" required />
                    </label>
                    <label>
                        Nationality:
                        <select name="nationality" value={guestData.nationality} onChange={handleChange} className="large-input" required>
                            <option value="">Select Nationality</option>
                            {countries.map(country => (
                                <option key={country.name} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Language:
                        <input type="text" name="language" value={guestData.language} onChange={handleChange} className="large-input" required />
                    </label>
                    <label>
                        Date of Birth:
                        <input type="date" name="date_of_birth" value={guestData.date_of_birth} onChange={handleChange} className="large-input" required/>
                    </label>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="form-section">
                <div className="section-container">
                    <h2 className="section-heading">Contact Information</h2>
                    <label>
                        Phone Code:
                        <select name="phone_code" value={guestData.phone_code} onChange={handleChange} className="large-input" required>
                            {countries.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.code})
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Phone Number:
                        <input type="text" name="phone_number" value={guestData.phone_number} onChange={handleChange} className="large-input" required/>
                    </label>
                    <label>
                        Email Address:
                        <input type="email" name="email" value={guestData.email} onChange={handleChange} className="large-input" required/>
                    </label>
                    <label>
                        Country:
                        <select name="country" value={guestData.country} onChange={handleChange} className="large-input" >
                            <option value="">Select Country</option>
                            {countries.map(country => (
                                <option key={country.name} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Region:
                        <input type="text" name="region" value={guestData.region} onChange={handleChange} className="large-input" required/>
                    </label>
                    <label>
                        City:
                        <input type="text" name="city" value={guestData.city} onChange={handleChange} className="large-input" required/>
                    </label>
                    <label>
                        Address:
                        <input type="text" name="address" value={guestData.address} onChange={handleChange} className="large-input" required/>
                    </label>
                    <label>
                        Zip Code:
                        <input type="text" name="zip_code" value={guestData.zip_code} onChange={handleChange} className="large-input" required/>
                    </label>
                </div>
            </section>

            {/* Payment Information Section */}
            <section className="form-section">
                <div className="section-container">
                    <h2 className="section-heading">Payment Information</h2>
                    <label>
                        Amount:
                        <input type="number" name="amount" value={guestData.amount} onChange={handleChange} className="large-input" min="0" required/>
                    </label>
                    <label>
                        Paid Amount:
                        <input type="number" name="paid_amount" value={guestData.paid_amount} onChange={handleChange} className="large-input" min="0" required/>
                    </label>
                    <label>
                        Pending Amount:
                        <input type="number" name="pending_amount" value={guestData.pending_amount} className="large-input" readOnly />
                    </label>
                </div>
            </section>

            <button style={{ backgroundColor: 'navy' }} type="submit" className="save-button">Save Guest</button>
        </form>
    );
}

export default Guestform;
