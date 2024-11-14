import React from 'react';
import './OccupancyTable.css';

function OccupancyTable({ data }) {
  return (
    <div className="occupancy-table">
      <h3>Daily Occupancy</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Occupancy Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>{item.occupancy_rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OccupancyTable;
