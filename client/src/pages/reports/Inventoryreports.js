import React, { useState, useEffect } from "react";
import axios from "axios";
import "./inventoryreport.css";

// Main Inventory Report Component
function Inventoryreport() {
  const [hotelId, setHotelId] = useState(1); // Example hotel ID
  const [reportData, setReportData] = useState([]); // Start with an empty array, no dummy data
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      fetchReport();
    }
  }, [startDate, endDate]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/inventory/${hotelId}/report`,
        { params: { start_date: startDate, end_date: endDate } }
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const exportReport = (format) => {
    window.location.href = `http://localhost:5000/api/inventory/${hotelId}/export/${format}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateReport = () => {
    fetchReport();
  };

  return (
    <div className="inventory-report">
      <h1>Inventory Report</h1>

      {/* Container for filters and report */}
      <div className="container">
        {/* Filters Section */}
        <div className="filters">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleGenerateReport}>Generate Report</button>
        </div>

        {/* Report Table */}
        <table className="report-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length === 0 ? (
              <tr>
                <td colSpan="4">No data available for the selected date range.</td>
              </tr>
            ) : (
              reportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.description}</td>
                  <td>{item.last_updated}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Export Buttons with Icons in a Row */}
        <div className="export-buttons">
          <button className="btn-export-csv" style = {{backgroundColor: '#28a745'}} onClick={() => exportReport("csv")}>
            <i className="fas fa-file-csv"></i> CSV
          </button>
          <button className="btn-export-xlsx" style = {{backgroundColor: '#007bff'}} onClick={() => exportReport("xlsx")}>
            <i className="fas fa-file-excel"></i> Excel
          </button>
          <button className="btn-export-pdf" style = {{backgroundColor: '#dc3545'}} onClick={() => exportReport("pdf")}>
            <i className="fas fa-file-pdf"></i> PDF
          </button>
        </div>

        {/* Print Button */}
        <div className="print-button">
          <button style = {{backgroundColor: '#ffc107'}} onClick={handlePrint}>
            <i className="fas fa-print"></i> Print
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inventoryreport;
