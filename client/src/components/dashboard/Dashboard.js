import React, {useState, useEffect} from 'react'
import './dashboard.css'
import axios from 'axios'
import io from 'socket.io-client'
import RevenueChart from '../dashboardcharts/RevenueChart/RevenueChart'
import BookingSourcePieChart from '../dashboardcharts/Bookingsource/BookingSourcePieChart'
import AverageRates from '../dashboardcharts/averagerates/AverageRates'
import OccupancyTable from '../dashboardcharts/OccupancyTable/OccupancyTable'

const socket = io('http://localhost:5000');


function Dashboard() {

    const [revenueData, setRevenueData] = useState([]);
    const [bookingSourceData, setBookingSourceData] = useState({})
    const [occupancyData, setOccupancyData] = useState([])
    const [date, setDate] = useState('')

    {/*useEffect(() => {
        const fetchData = async () => {
            try{
                const revenueResponse = await axios.get(`/api/revenue?hotel_id=1&date=${date}`);
                const bookingSourceResponse = await axios.get(`/api/booking-source?hotel_id=1`);
                const occupancyResponse = await axios.get(`/api/occupancy?hotel_id=1&date=${date}`);

                setRevenueData(revenueResponse.data);
                setBookingSourceData(bookingSourceResponse.data);
                setOccupancyData(occupancyResponse.data);
            }
            catch (error) {
                console.log('Error Fetching data')
            }
        };
        fetchData();

        socket.on('update_data', (data) =>{
            setRevenueData(data.revenue);
            setBookingSourceData(data.booking_source);
            setOccupancyData(data.occupancy);
        })

        return() => socket.disconnect();
    }, [date]);
*/} // if we are fetching data from the backend

// we are using dummy data here

const dummyRevenueData = [
    { date: '2024-10-01', rooms_revenue: 1500, food_beverages_revenue: 700, other_sources_revenue: 300 },
    { date: '2024-10-02', rooms_revenue: 1700, food_beverages_revenue: 800, other_sources_revenue: 400 },
    { date: '2024-10-03', rooms_revenue: 1200, food_beverages_revenue: 650, other_sources_revenue: 200 },
    { date: '2024-10-04', rooms_revenue: 1800, food_beverages_revenue: 900, other_sources_revenue: 500 },
    { date: '2024-10-05', rooms_revenue: 2000, food_beverages_revenue: 950, other_sources_revenue: 600 },
];

const dummyBookingSourceData = {
    online_channel: 400,
    offline_channel: 200,
    repeat_clients: 150,
    website_channel: 100,
    referrals: 50,
};

const dummyOccupancyData = [
    { date: '2024-10-01', occupancy_rate: 75 },
    { date: '2024-10-02', occupancy_rate: 80 },
    { date: '2024-10-03', occupancy_rate: 65 },
    { date: '2024-10-04', occupancy_rate: 90 },
    { date: '2024-10-05', occupancy_rate: 85 },
];


useEffect(() => {
    const fetchData = async () => {
        try {
            const revenueResponse = await axios.get(`/api/revenue?hotel_id=1&date=${date}`);
            const bookingSourceResponse = await axios.get(`/api/booking-source?hotel_id=1`);
            const occupancyResponse = await axios.get(`/api/occupancy?hotel_id=1&date=${date}`);

            // Check if data is empty and use dummy data if so
            setRevenueData(revenueResponse.data.length > 0 ? revenueResponse.data : dummyRevenueData);
            setBookingSourceData(bookingSourceResponse.data.length > 0 ? bookingSourceResponse.data : dummyBookingSourceData);
            setOccupancyData(occupancyResponse.data.length > 0 ? occupancyResponse.data : dummyOccupancyData);
        } catch (error) {
            console.log('Error Fetching data');
            // Fallback to dummy data on error
            setRevenueData(dummyRevenueData);
            setBookingSourceData(dummyBookingSourceData);
            setOccupancyData(dummyOccupancyData);
        }
    };
    fetchData();

    socket.on('update_data', (data) => {
        setRevenueData(data.revenue);
        setBookingSourceData(data.booking_source);
        setOccupancyData(data.occupancy);
    });

    return () => socket.disconnect();
}, [date]);



  return (
    <div className = "dashboard">
        <h2>Hotel Management Dashboard</h2>
        <select onChange={(e) => setDate(e.target.value)}>
           <option value="">Select Month</option>
           <option value="2024-01">January</option>
           <option value="2024-02">February</option>
           <option value="2024-03">March</option>
           <option value="2024-04">April</option>
           <option value="2024-05">May</option>
           <option value="2024-06">June</option>
           <option value="2024-07">July</option>
           <option value="2024-08">August</option>
           <option value="2024-09">September</option>
           <option value="2024-10">October</option>
           <option value="2024-11">November</option>
           <option value="2024-12">December</option>
        </select>

        <RevenueChart data = {revenueData} />
        <BookingSourcePieChart data = {bookingSourceData} />
        <AverageRates data = {revenueData} />
        <OccupancyTable data = {occupancyData} />
    </div>
  )
}

export default Dashboard