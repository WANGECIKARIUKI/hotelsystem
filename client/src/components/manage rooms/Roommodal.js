import React, { useState, useEffect } from 'react';
import './RoomModal.css'; // CSS for styling the modal

function Roommodal({ modalData, onClose, onAddRoom, onCheckIn, onCheckOut, onBookRoom, onEditRoom }) {
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomType: '',
        customerName: '',
        contactNumber: '',
        emailAddress: '',
        homeAddress: '',
        checkInDate: '',
        checkOutDate: '',
        totalPrice: 0,
        advancePayment: 0,
        remainingAmount: 0,
    });

    useEffect(() => {
        if (modalData.room) {
            setFormData({
                roomNumber: modalData.room.room_number,
                roomType: modalData.room.room_type,
                customerName: modalData.room.customer_name || '',
                contactNumber: modalData.room.contact_number || '',
                emailAddress: modalData.room.email_address || '',
                homeAddress: modalData.room.home_address || '',
                checkInDate: modalData.room.checkin_date || '',
                checkOutDate: modalData.room.checkout_date || '',
                totalPrice: modalData.room.total_price || 0,
                advancePayment: modalData.room.advance_payment || 0,
                remainingAmount: modalData.room.remaining_amount || 0,
            });
        }
    }, [modalData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = () => {
        switch (modalData.action) {
            case 'add':
                onAddRoom(formData);
                break;
            case 'book':
                onBookRoom(formData);
                break;
            case 'checkin':
                onCheckIn(formData);
                break;
            case 'checkout':
                onCheckOut(formData);
                break;
            case 'edit':
                onEditRoom(formData);
                break;
            default:
                break;
        }
        onClose();
    };

    const renderFormFields = () => {
        switch (modalData.action) {
            case 'add':
                return (
                    <>
                        <label>Room Number:</label>
                        <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} />
                        <label>Room Type:</label>
                        <input type="text" name="roomType" value={formData.roomType} onChange={handleInputChange} />
                    </>
                );
            case 'book':
            case 'checkin':
                return (
                    <>
                        <label>Customer Name:</label>
                        <input type="text" name="customerName" value={formData.customerName} readOnly />
                        <label>Contact Number:</label>
                        <input type="text" name="contactNumber" value={formData.customerName} readOnly />
                        <label>Email Address:</label>
                        <input type="email" name="emailAddress" value={formData.customerName} readOnly />
                        <label>Home Address:</label>
                        <input type="text" name="homeAddress" value={formData.customerName} readOnly />
                        <label>Check-in Date:</label>
                        <input type="date" name="checkInDate" value={formData.customerName} readOnly />
                        <label>Check-out Date:</label>
                        <input type="date" name="checkOutDate" value={formData.customerName} readOnly />
                        <label>Total Price:</label>
                        <input type="number" name="totalPrice" value={formData.customerName} readOnly />
                        <label>Advance Payment:</label>
                        <input type="number" name="advancePayment" value={formData.customerName} readOnly />
                        <label>Remaining Amount:</label>
                        <input type="number" name="remainingAmount" value={formData.totalPrice - formData.advancePayment} readOnly />
                    </>
                );
            case 'checkout':
                return (
                    <>
                        <label>Customer Name:</label>
                        <input type="text" name="customerName" value={formData.customerName} readOnly />
                        <label>Room Number:</label>
                        <input type="text" name="roomNumber" value={formData.roomNumber} readOnly />
                        <label>Check-in Date:</label>
                        <input type="date" name="checkInDate" value={formData.checkInDate} readOnly />
                        <label>Check-out Date:</label>
                        <input type="date" name="checkOutDate" value={formData.checkOutDate} readOnly />
                        <label>Total Amount:</label>
                        <input type="number" name="totalPrice" value={formData.totalPrice} readOnly />
                        <label>Remaining Amount:</label>
                        <input type="number" name="remainingAmount" value={formData.totalPrice - formData.advancePayment} onChange={handleInputChange} />
                    </>
                );
            case 'view':
                return (
                    <>
                        <label>Customer Name:</label>
                        <p>{formData.customerName}</p>
                        <label>Contact Number:</label>
                        <p>{formData.contactNumber}</p>
                        <label>Email Address:</label>
                        <p>{formData.emailAddress}</p>
                        <label>Home Address:</label>
                        <p>{formData.homeAddress}</p>
                        <label>Check-in Date:</label>
                        <p>{formData.checkInDate}</p>
                        <label>Check-out Date:</label>
                        <p>{formData.checkOutDate}</p>
                        <label>Total Amount:</label>
                        <p>{formData.totalPrice}</p>
                        <label>Advance Payment:</label>
                        <p>{formData.advancePayment}</p>
                        <label>Remaining Amount:</label>
                        <p>{formData.totalPrice - formData.advancePayment}</p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>
                    {modalData.action === 'add' ? 'Add Room' :
                     modalData.action === 'edit' ? 'Edit Room' :
                     modalData.action === 'view' ? 'Room Details' :
                     modalData.action === 'book' ? 'Book Room' :
                     modalData.action === 'checkin' ? 'Check In' : 'Check Out'}
                </h3>
                <form>
                    {renderFormFields()}
                    {modalData.action !== 'view' && <button type="button" onClick={handleSubmit}>{modalData.action === 'checkout' ? 'Check Out' : 'Submit'}</button>}
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

export default Roommodal;
