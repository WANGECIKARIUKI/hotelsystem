import React, { useState } from 'react';
import axios from 'axios';
import './orderreport.css';
import { FaDownload, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa'; // Importing icons

const Orderreport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleDownloadReport = (format) => {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            format,
        }).toString();

        window.location.href = `/api/orders/report/export?${params}`;
    };

    const handleGenerateReport = async () => {
        try {
            const response = await axios.get('/api/orders/report', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
            });
            console.log('Report generated:', response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handlePrintReport = () => {
        window.print();  // Triggers the browser print dialog
    };

    return (
        <div className="order-report-container">
            <h1>Generate Order Report</h1>

            <div className="form-group">
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <div>
                <button onClick={handleGenerateReport}>Generate Report</button>
            </div>

            <div className="button-container">
                <button
                    className="download-btn csv-btn"
                    onClick={() => handleDownloadReport('csv')}
                >
                    <FaDownload /> CSV
                </button>
                <button
                    className="download-btn excel-btn"
                    onClick={() => handleDownloadReport('xlsx')}
                >
                    <FaFileExcel /> Excel
                </button>
                <button
                    className="download-btn pdf-btn"
                    onClick={() => handleDownloadReport('pdf')}
                >
                    <FaFilePdf /> PDF
                </button>
                <button
                    className="print-btn"
                    onClick={handlePrintReport}
                >
                    <FaPrint /> Print
                </button>
            </div>
        </div>
    );
};

export default Orderreport;
