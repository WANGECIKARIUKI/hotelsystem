import React, {useState, useEffect} from "react";
import './invoicelist.css';
const InvoiceList = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Function to calculate time remaining
  function calculateTimeLeft() {
    const targetDate = new Date("2025-01-31T00:00:00"); // Set your target launch date here
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="under-construction">
      <div className="construction-message">
        <h1>🚧 We're working on something amazing!</h1>
        <p>Check back soon. Our page is under construction.</p>

        <div className="timer">
          <p>Launch in:</p>
          <div className="countdown">
            <span>{timeLeft.days} Days</span>
            <span>{timeLeft.hours} Hours</span>
            <span>{timeLeft.minutes} Minutes</span>
            <span>{timeLeft.seconds} Seconds</span>
          </div>
        </div>
      </div>

      <div className="animation">
        {/* Bouncing construction cone */}
        <div className="cone-container">
          <div className="cone"></div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;



/*import React, { useState, useEffect } from 'react';
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

export default InvoiceList; */
