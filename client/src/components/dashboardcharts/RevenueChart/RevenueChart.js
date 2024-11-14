import React from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register components
ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title
);

function RevenueChart({ data }) {
    const chartData = {
        labels: data.map((item) => item.date),
        datasets: [
            {
                label: 'Rooms Revenue',
                data: data.map((item) => item.rooms_revenue),
                borderColor: '#4caf50',
                fill: false,
            },
            {
                label: 'Foods & Beverages',
                data: data.map((item) => item.food_beverages_revenue),
                borderColor: '#ff9800',
                fill: false,
            },
            {
                label: 'Other sources of Revenue',
                data: data.map((item) => item.other_sources_revenue),
                borderColor: '#03a9f4',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                    },
                },
            },
            title: {
                display: true,
                text: 'Daily Revenue Overview',
            },
        },
        animation: {
            duration: 1000,
        },
    };

    return (
        <div className="chart">
            <h3>Daily Revenue</h3>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default RevenueChart;
