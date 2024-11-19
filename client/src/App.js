import './App.css';
import {Routes, Route} from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard';
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
//import Frontdesk from './components/frontdesk/Frontdesk';
//import Housekeeping from './components/housekeeping/Housekeeping';
//import Inventorymanagement from './components/inventory management/Inventorymanagement';
//import POS from './components/frontdeskPOS/POS';
//import Salesreport from './components/frontdeskPOS/Salesreport';

function App() {


  return (
    <div className="main-content">

      <Sidebar />

      <Routes>
        <Route path = '/' element = {<Dashboard1 />} />
        <Route path = '/dashboard' element = {<Dashboard />} />
        <Route path = '/frontdesk' element = {<Frontdesk />} />
        <Route path = '/reservations' element = {<Reservation />} />
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
        <Route path = '/addorder' element = {<AddOrder/>} />
        <Route path = '/addcategory' element = {<AddCategory/>} />
        <Route path = '/createservice' element = {<Createservice />} />
        <Route path ='/communication' element = {<Communication/>} />
        <Route path = '/invoices' element = {<Createinvoice/>} />
        <Route path = '/inventory' element = {<Inventory/>} />
        <Route path = '/inventoryreport' element = {<Inventoryreport/>} />

      </Routes>
      
    </div>
  );
}

export default App;
