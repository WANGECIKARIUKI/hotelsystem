import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
// Register components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function BookingSourcePieChart({ data }) {
    const chartData = {
        labels: ['Online Channel', 'Offline Channel', 'Website Channel', 'Referrals', 'Repeat Clients'],
        datasets: [
            {
                data: [
                    data.online_channel,
                    data.offline_channel,
                    data.repeat_clients,
                    data.website_channel,
                    data.referrals,
                ],
                backgroundColor: ['#4caf50', '#ff9800', '#03a9f4', '#e91e63', '#9c27b0'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Booking Sources Overview',
            },
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    return (
        <div className="chart">
            <h3>Booking Sources</h3>
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default BookingSourcePieChart;
