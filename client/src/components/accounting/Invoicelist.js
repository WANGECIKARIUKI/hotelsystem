import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvoiceList() {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        axios.get('/invoices?hotel_id=1') // Replace with dynamic hotel_id
            .then(response => setInvoices(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Invoices</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Guest Name</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.invoice_date}</td>
                            <td>{invoice.guest_name}</td>
                            <td>{invoice.status}</td>
                            <td>{invoice.net_amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InvoiceList;
