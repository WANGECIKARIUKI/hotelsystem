import './App.css';
import React, {useEffect} from 'react';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
//import Dashboard from './components/dashboard/Dashboard';
import Reservation from './components/reservations/Reservation';
import Dashboard1 from './components/dashboard1/Dashboard1';
import Managerooms from './components/manage rooms/Managerooms';
import Newstaff from './components/humanresource/newstaff/Newstaff';
import Managestaff from './components/humanresource/managestaff/Managestaff';
import Staffdetails from './components/humanresource/managestaff/Staffdetails';
import Managecomplaints from './components/humanresource/managecomplaints/Managecomplaints';
import Sidebar from './pages/header/sidebar/Sidebar';
import Frontdesk from './components/frontdesk/Frontdesk';
import Guestform from './components/Guest management/Guestform';
import Guestmanagement from './components/Guest management/Guestmanagement';
import Housekeeping from './components/Housekeepng/Housekeeping';
import Orders from './components/orders/Orders';
import Category from './components/category/Category';
import Services from './components/services/Services';
import AddOrder from './components/orders/AddOrder';
import AddCategory from './components/category/AddCategory';
import Createservice from './components/services/Createservice';
import Communication from './components/communications/communication';
import Createinvoice from './components/accounting/Createinvoice';
import Inventory from './components/inventory/Inventory';
import Inventoryreport from './pages/reports/Inventoryreports';
import Orderreport from './pages/reports/Orderreport';
import Servicereport from './pages/reports/Servicereport';
import Guestreport from './pages/reports/Guestreport';
import Logout from './pages/Login/Logout';
import Login from './pages/Login/Login';
import Changepassword from './pages/Login/Changepassword';
import Settings from './pages/Settings/Settings';
import Navbar from './pages/header/navbar/Navbar';
import InvoiceList from './components/accounting/Invoicelist';
//import Frontdesk from './components/frontdesk/Frontdesk';
//import Housekeeping from './components/housekeeping/Housekeeping';
//import Inventorymanagement from './components/inventory management/Inventorymanagement';
//import POS from './components/frontdeskPOS/POS';
//import Salesreport from './components/frontdeskPOS/Salesreport';

function App() {
//login authentiation

const [isLoggedIn, setIsLoggedIn] = React.useState(false);

useEffect(() => {
  let timeout;

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handleLogout();
    }, 1200 * 1000); // 20 minutes in milliseconds
  };

  if (isLoggedIn) {
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onkeypress = resetTimer;
  }

  return () => {
    clearTimeout(timeout);
  };
}, [isLoggedIn]);

const handleLoginSuccess = () => {
  setIsLoggedIn(true);
};

const handleLogout = () => {
  setIsLoggedIn(false);
};

  return (
    <div className="main-content">
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      {/*<Sidebar />*/}
      {isLoggedIn && <Sidebar onLogout={handleLogout} />}
      

      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard1 /> : <Navigate to="/" />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" />} />
        {/*<Route path = '/dashboard' element = {<Dashboard />} />*/}
        <Route path = '/frontdesk' element = {<Frontdesk />} />
        <Route path="/reservation" element={<div className="reservation-container"><Reservation /></div>} />
        <Route path = '/managerooms' element = {<Managerooms />} />
        <Route path = '/newstaff' element = {<Newstaff />} />
        <Route path = '/managestaff' element = {<Managestaff />} />
        <Route path="/staff/:id" element={<Staffdetails />} /> {/* Route to StaffDetail */}
        <Route path = '/managecomplaints' element={<Managecomplaints/>} />
        <Route path = '/guestform' element = {<Guestform />} />
        <Route path = '/guestmanagement' element = {<Guestmanagement/>} />
        <Route path = "/housekeeping" element = {<Housekeeping/>} />
        <Route path = '/services' element = {<Services/>} />
        <Route path = '/category' element = {<Category/>} />
        <Route path = '/orders' element = {<Orders/>} />
        <Route path = '/createorder' element = {<AddOrder/>} />
        <Route path = '/createcategory' element = {<AddCategory/>} />
        <Route path = '/createservice' element = {<Createservice />} />
        <Route path ='/communication' element = {<Communication/>} />
        <Route path = '/invoicelist' element = {<InvoiceList />} />
        <Route path = '/invoices' element = {<Createinvoice/>} />
        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/inventoryreport' element = {<Inventoryreport/>} />
        <Route path = '/orderreport' element = {<Orderreport/>} />
        <Route path = '/servicereport' element = {<Servicereport/>} />
        <Route path = '/guestreport' element = {<Guestreport/>} />
        <Route path = '/changepassword' element = {<Changepassword/>} />
        <Route path = '/settings' element = {<Settings />} />

      </Routes>
      
    </div>
  );
}

export default App;
