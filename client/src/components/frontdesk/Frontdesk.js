import React, { useState, useEffect } from "react";  // Import React and hooks (useState, useEffect)
import './front.css';  // Import custom CSS for styling

// Frontdesk component
const Frontdesk = () => {
  // State hook to track the time remaining until the target launch date
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Function to calculate the remaining time until the target date
  function calculateTimeLeft() {
    const targetDate = new Date("2025-01-31T00:00:00"); // Set your target launch date here
    const now = new Date();  // Get the current date and time
    const difference = targetDate - now;  // Calculate the difference in milliseconds

    // If the target date has passed, return 0 for all time values
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    // Calculate remaining time in days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));  // Days remaining
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));  // Hours remaining
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));  // Minutes remaining
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);  // Seconds remaining

    return { days, hours, minutes, seconds };  // Return the remaining time in an object
  }

  // useEffect hook to update the countdown every second
  useEffect(() => {
    // Set up an interval to update the time left every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());  // Update state with the new time
    }, 1000);

    // Cleanup the interval when the component unmounts or updates
    return () => clearInterval(timer);
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="under-construction">
      <div className="construction-message">
        <h1>🚧 We're working on something amazing!</h1> {/* Main title with construction emoji */}
        <p>Check back soon. Our page is under construction.</p> {/* Descriptive message */}

        {/* Countdown timer section */}
        <div className="timer">
          <p>Launch in:</p>
          <div className="countdown">
            {/* Display remaining time dynamically */}
            <span>{timeLeft.days} Days</span>
            <span>{timeLeft.hours} Hours</span>
            <span>{timeLeft.minutes} Minutes</span>
            <span>{timeLeft.seconds} Seconds</span>
          </div>
        </div>
      </div>

      {/* Animation section */}
      <div className="animation">
        {/* Bouncing construction cone animation */}
        <div className="cone-container">
          <div className="cone"></div>  {/* The animated cone */}
        </div>
      </div>
    </div>
  );
};

export default Frontdesk;









/*
import React, { useState, useEffect } from 'react';
import './front.css';

function Frontdesk() {
  // State hooks for handling different aspects of the front desk interface
  const [reservations, setReservations] = useState([]); // Stores reservation data
  const [rooms, setRooms] = useState([]); // Stores available rooms data
  const [filters, setFilters] = useState({ // Stores filter criteria for filtering room reservations
    housekeeping: '',
    facilities: '',
    roomType: '',
    bookingOption: ''
  });
  const [filterOptions, setFilterOptions] = useState({}); // Stores available options for filters
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Tracks the currently selected month for the calendar
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Tracks the current year for the calendar
  const [hoveredRoom, setHoveredRoom] = useState(null); // Tracks the room currently being hovered over for room details
  const [showRoomDetails, setShowRoomDetails] = useState(null); // Stores the details of the room being clicked for more info

  // Expanded Dummy Data: for testing, as if fetched from an API
  const dummyRooms = [
    { id: 1, room_number: '101', room_type: 'Deluxe', beds: 2, bed_type: 'Queen', facilities: 'Wi-Fi, AC', images: ['room1.jpg', 'room2.jpg'] },
    { id: 2, room_number: '102', room_type: 'Standard', beds: 1, bed_type: 'Single', facilities: 'Wi-Fi, TV', images: ['room3.jpg', 'room4.jpg'] },
    { id: 3, room_number: '201', room_type: 'Suite', beds: 3, bed_type: 'King', facilities: 'Wi-Fi, AC, TV', images: ['room5.jpg', 'room6.jpg'] },
  ];

  const dummyReservations = [
    { id: 1, guest_name: 'John Doe', room_number: '101', check_in: '2024-11-10', check_out: '2024-11-12' },
    { id: 2, guest_name: 'Jane Smith', room_number: '102', check_in: '2024-11-11', check_out: '2024-11-13' },
  ];

  const dummyFilterOptions = {
    housekeeping: ['Clean', 'Dirty', 'In Progress'],
    facilities: ['Wi-Fi', 'TV', 'AC'],
    roomType: ['Deluxe', 'Standard', 'Suite'],
    bookingOption: ['Direct', 'OTA', 'Phone']
  };

  // Simulate data fetching using useEffect to update state on component mount
  useEffect(() => {
    try {
      // Assuming API calls or data fetching logic here
      setRooms(dummyRooms);
      setReservations(dummyReservations);
      setFilterOptions(dummyFilterOptions);
    } catch (error) {
      // Fallback to dummy data in case of an error
      console.error("Data fetch failed, using dummy data", error);
      setRooms(dummyRooms);
      setReservations(dummyReservations);
      setFilterOptions(dummyFilterOptions);
    }
  }, []);

  // Handle filter changes when user selects an option
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Clear all active filters
  const clearFilters = () => {
    setFilters({ housekeeping: '', facilities: '', roomType: '', bookingOption: '' });
  };

  // Function to render the calendar days dynamically based on current month and year
  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Get the first day of the current month
    const calendarDays = [];

    // Render days of the week at the top
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
      calendarDays.push(<div key={day} className="calendar-header">{day}</div>);
    });

    // Empty spaces for the first week days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-empty-day"></div>);
    }

    // Render the actual calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const reservation = reservations.filter(r => r.check_in <= currentDay && r.check_out >= currentDay);

      // Add each day to the calendar grid with its status (booked or available)
      calendarDays.push(
        <div key={day} className={`calendar-day ${reservation.length ? 'booked-day' : 'available-day'}`}>
          <span>{day}</span>
          {reservation.map(r => (
            <div
              key={r.id}
              className="client-name"
              onClick={() => setShowRoomDetails(r)} // Show details when a reservation is clicked
            >
              {r.guest_name}
            </div>
          ))}
        </div>
      );
    }

    return <div className="calendar-grid">{calendarDays}</div>;
  };

  // Handle room hover event to show room details popup
  const handleRoomHover = (room) => {
    setHoveredRoom(room);
  };

  // Close the room details popup when hovering stops
  const closeRoomPopup = () => {
    setHoveredRoom(null);
  };

  // Close the reservation details popup when clicking close
  const closeDetailsPopup = () => {
    setShowRoomDetails(null);
  };

  return (
    <div className="front-desk-container">
      <header className="front-desk-header">
        <div className="year-month-selector">
          <button onClick={() => setCurrentYear(currentYear - 1)}>&lt;</button>
          <span>{currentYear}</span>
          <button onClick={() => setCurrentYear(currentYear + 1)}>&gt;</button>
          <div className="months">
            {Array.from({ length: 12 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentMonth(i)}
                className={currentMonth === i ? 'active' : ''}
              >
                {new Date(0, i).toLocaleString('default', { month: 'short' })}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => window.location.href = '/reservations'}>Go to Reservations</button>
      </header>

      <section className="sidebar">
        <h3>Available Rooms</h3>
        {rooms.map(room => (
          <div
            key={room.id}
            className="room-item"
            onMouseEnter={() => handleRoomHover(room)}
            onMouseLeave={closeRoomPopup}
          >
            <span>{room.room_number} - {room.room_type}</span>
          </div>
        ))}
      </section>

      <section className="main-content">
        <section className="filter-section">
          <input type="text" placeholder="Search by booking number or guest name" />
          <div className="filter-dropdowns">
            {['housekeeping', 'facilities', 'roomType', 'bookingOption'].map(filter => (
              <div key={filter}>
                <label>{filter.charAt(0).toUpperCase() + filter.slice(1)}:</label>
                <select name={filter} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {filterOptions[filter]?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button onClick={clearFilters}>Clear Filters</button>
        </section>

        <section className="calendar-section">
          <h3>Calendar</h3>
          {renderCalendarDays()}
        </section>
      </section>

      {/* Show room details when a client name is clicked */
      /*{showRoomDetails && (
        <div className="room-popup">
          <button onClick={closeDetailsPopup}>Close</button>
          <h4>{showRoomDetails.guest_name} - {showRoomDetails.room_number}</h4>
          <p>Room Type: {showRoomDetails.room_type}</p>
          <p>Check-in: {showRoomDetails.check_in}</p>
          <p>Check-out: {showRoomDetails.check_out}</p>
        </div>
      )}
    </div>
  );
}

export default Frontdesk;
*/
