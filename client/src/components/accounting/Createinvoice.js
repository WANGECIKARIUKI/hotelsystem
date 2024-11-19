import React, { useState } from 'react';
import axios from 'axios';

function Createinvoice() {
    const [form, setForm] = useState({
        guestName: '',
        email: '',
        invoiceDate: '',
        items: [{ serviceName: '', quantity: 1, netAmount: 0, vatPercentage: 0, discount: 0 }],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = [...form.items];
        updatedItems[index][name] = value;
        setForm({ ...form, items: updatedItems });
    };

    const addItem = () => {
        setForm({
            ...form,
            items: [...form.items, { serviceName: '', quantity: 1, netAmount: 0, vatPercentage: 0, discount: 0 }],
        });
    };

    const removeItem = (index) => {
        const updatedItems = form.items.filter((_, i) => i !== index);
        setForm({ ...form, items: updatedItems });
    };

    const handleSubmit = () => {
        axios.post('/create_invoice', form)
            .then(() => alert('Invoice created!'))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Create Invoice</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Guest Name:</label>
                    <input
                        type="text"
                        name="guestName"
                        value={form.guestName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Invoice Date:</label>
                    <input
                        type="date"
                        name="invoiceDate"
                        value={form.invoiceDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <h3>Invoice Items</h3>
                {form.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: '1em', border: '1px solid #ddd', padding: '10px' }}>
                        <div>
                            <label>Service Name:</label>
                            <input
                                type="text"
                                name="serviceName"
                                value={item.serviceName}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                            />
                        </div>
                        <div>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, e)}
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label>Net Amount:</label>
                            <input
                                type="number"
                                name="netAmount"
                                value={item.netAmount}
                                onChange={(e) => handleItemChange(index, e)}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label>VAT Percentage:</label>
                            <input
                                type="number"
                                name="vatPercentage"
                                value={item.vatPercentage}
                                onChange={(e) => handleItemChange(index, e)}
                                min="0"
                                max="100"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label>Discount:</label>
                            <input
                                type="number"
                                name="discount"
                                value={item.discount}
                                onChange={(e) => handleItemChange(index, e)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <button type="button" onClick={() => removeItem(index)}>Remove Item</button>
                    </div>
                ))}

                <button type="button" onClick={addItem}>Add Item</button>

                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleSubmit}>Create Invoice</button>
                </div>
            </form>
        </div>
    );
}

export default Createinvoice;
