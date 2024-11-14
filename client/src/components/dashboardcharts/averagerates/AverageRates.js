import React from 'react';

function AverageRates({ revenueData = [] }) { // Default to an empty array if undefined

    // Total revenue calculations for all revenue channels
    const totalRevenue = revenueData.reduce((acc, curr) => acc + (curr.rooms_revenue || 0) + (curr.food_beverages_revenue || 0) + (curr.other_sources_revenue || 0), 0);

    // Calculating average occupancy rate
    const occupancyRate = revenueData.length > 0 
        ? (revenueData.reduce((acc, curr) => acc + (curr.occupancy_rate || 0), 0) / revenueData.length).toFixed(2) 
        : '0.00';

    return (
        <div className='average'>
            <h3>Average Rates</h3>
            <p>Average Daily Rates: ${revenueData.length > 0 ? (totalRevenue / revenueData.length).toFixed(2) : '0.00'}</p>
            <p>Revenue per Available Room: ${(totalRevenue / (revenueData.length * 100)).toFixed(2)}</p>
            <p>Occupancy Rate: {occupancyRate}%</p>
        </div>
    );
}

export default AverageRates;
