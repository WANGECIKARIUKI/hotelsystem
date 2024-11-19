import React, { useState, useEffect } from "react";
import axios from "axios";
import "./inventoryreport.css";

function Inventoryreport() {
  const [hotelId, setHotelId] = useState(1); // Example hotel ID
  const [reportData, setReportData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchReport();
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

  return (
    <div className="inventory-report">
      <h1>Inventory Report</h1>
      <div className="filters">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchReport}>Generate Report</button>
      </div>
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
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.item_name}</td>
              <td>{item.quantity}</td>
              <td>{item.description}</td>
              <td>{item.last_updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="export-buttons">
        <button onClick={() => exportReport("csv")}>Export CSV</button>
        <button onClick={() => exportReport("xlsx")}>Export Excel</button>
        <button onClick={() => exportReport("pdf")}>Export PDF</button>
      </div>
    </div>
  );
}

export default Inventoryreport;
