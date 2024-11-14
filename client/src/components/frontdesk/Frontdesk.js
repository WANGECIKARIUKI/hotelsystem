import React, { useState, useEffect } from 'react';
import './front.css';

function Frontdesk() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    housekeeping: '',
    facilities: '',
    roomType: '',
    bookingOption: ''
  });
  const [filterOptions, setFilterOptions] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [showRoomDetails, setShowRoomDetails] = useState(null);

  // Expanded Dummy Data
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

  // Simulate data fetch
  useEffect(() => {
    try {
      // Assuming API calls or some data fetching logic
      setRooms(dummyRooms);
      setReservations(dummyReservations);
      setFilterOptions(dummyFilterOptions);
    } catch (error) {
      // In case of error, fallback to dummy data
      console.error("Data fetch failed, using dummy data", error);
      setRooms(dummyRooms);
      setReservations(dummyReservations);
      setFilterOptions(dummyFilterOptions);
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ housekeeping: '', facilities: '', roomType: '', bookingOption: '' });
  };

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const calendarDays = [];

    // Render days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
      calendarDays.push(<div key={day} className="calendar-header">{day}</div>);
    });

    // Empty spaces before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-empty-day"></div>);
    }

    // Render each day in the calendar
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const reservation = reservations.filter(r => r.check_in <= currentDay && r.check_out >= currentDay);

      calendarDays.push(
        <div key={day} className={`calendar-day ${reservation.length ? 'booked-day' : 'available-day'}`}>
          <span>{day}</span>
          {reservation.map(r => (
            <div
              key={r.id}
              className="client-name"
              onClick={() => setShowRoomDetails(r)}
            >
              {r.guest_name}
            </div>
          ))}
        </div>
      );
    }

    return <div className="calendar-grid">{calendarDays}</div>;
  };

  const handleRoomHover = (room) => {
    setHoveredRoom(room);
  };

  const closeRoomPopup = () => {
    setHoveredRoom(null);
  };

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

      {/* Show room details when a client name is clicked */}
      {showRoomDetails && (
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
