from app import db
from datetime import datetime
from models import (
    HotelRevenue, BookingSource, OccupancyRate, Hotel, Room, Reservation, Staff, 
    Notification, Complaint, NextOfKin, Guest, Booking, Service, Payment, 
    Invoice, InvoiceItem, Inventory, Order, CommunicationChannel, Message, 
    Expense, Report, Revenue, Staff
)
import random
import string

def create_hotel():
    hotel = Hotel(
        name="Hotel Example",
        total_rooms=100,
        revenue_generated=0.0
    )
    db.session.add(hotel)
    db.session.commit()
    return hotel

def create_room(hotel):
    room = Room(
        hotel_id=hotel.id,
        room_type="Single",
        room_number="101",
        price=100.0
    )
    db.session.add(room)
    db.session.commit()
    return room

def create_reservation(hotel, room):
    reservation = Reservation(
        hotel_id=hotel.id,
        room_type="Single",
        room_number=room.room_number,
        check_in_date=datetime(2024, 12, 19),
        check_out_date=datetime(2024, 12, 20),
        no_of_rooms=1,
        no_of_adults=2,
        no_of_children=0,
        amount=200.0,
        first_name="John",
        last_name="Doe",
        email="johndoe@example.com",
        home_address="123 Main St, City, Country",
        telephone="123-456-7890"
    )
    db.session.add(reservation)
    db.session.commit()
    return reservation

def create_staff(hotel):
    staff = Staff(
        hotel_id=hotel.id,
        name="Alice Smith",
        phone_number="9876543210",
        address="456 Street, City, Country",
        role="Manager",
        shift="Morning",
        salary=3000.0
    )
    db.session.add(staff)
    db.session.commit()
    return staff

def create_complaint(hotel):
    complaint = Complaint(
        hotel_id=hotel.id,
        complainant_name="Jane Doe",
        complaint_type="Noise",
        complaint_description="Loud noises from neighboring room.",
        resolved=False
    )
    db.session.add(complaint)
    db.session.commit()
    return complaint

def create_guest():
    guest = Guest(
        first_name="Michael",
        last_name="Johnson",
        guest_id="GUEST1234",
        email="michael.johnson@example.com",
        phone_number="555-1234"
    )
    db.session.add(guest)
    db.session.commit()
    return guest

def create_booking(guest, hotel, room):
    booking = Booking(
        guest_id=guest.id,
        room_id=room.id,
        check_in_date=datetime(2024, 12, 19),
        check_out_date=datetime(2024, 12, 20),
        status="Reserved"
    )
    db.session.add(booking)
    db.session.commit()
    return booking

def create_invoice(guest, hotel):
    invoice = Invoice(
        guest_id=guest.id,
        hotel_id=hotel.id,
        invoice_date=datetime(2024, 12, 19),
        invoice_number="INV00123",
        status="expectant",
        net_amount=200.0,
        gross_amount=230.0
    )
    db.session.add(invoice)
    db.session.commit()
    return invoice

def create_invoice_item(invoice):
    item = InvoiceItem(
        invoice_id=invoice.id,
        service_name="Room Service",
        quantity=1,
        net_amount=200.0,
        vat_percentage=15.0
    )
    db.session.add(item)
    db.session.commit()
    return item

def create_inventory(hotel):
    inventory = Inventory(
        hotel_id=hotel.id,
        item_name="Towels",
        quantity=100,
        description="Soft cotton towels",
        last_updated=datetime.utcnow()
    )
    db.session.add(inventory)
    db.session.commit()
    return inventory

def create_report(hotel):
    report = Report(
        hotel_id=hotel.id,
        total_revenue=5000.0,
        total_expenses=2000.0,
        total_profit=3000.0,
        report_type="monthly",
        created_on=datetime.utcnow()
    )
    db.session.add(report)
    db.session.commit()
    return report

def create_communication_channel(hotel):
    channel = CommunicationChannel(
        hotel_id=hotel.id,
        type="email"
    )
    db.session.add(channel)
    db.session.commit()
    return channel

def create_message(channel):
    message = Message(
        channel_id=channel.id,
        sender_type="employee",
        sender_id=1,
        recipient_id=2,
        subject="Reservation Confirmation",
        message="Your reservation has been confirmed.",
    )
    db.session.add(message)
    db.session.commit()
    return message

# Validation Methods

def validate_hotel_data(hotel_data):
    if len(hotel_data['name']) == 0:
        raise ValueError("Hotel name cannot be empty.")
    if hotel_data['total_rooms'] <= 0:
        raise ValueError("Hotel must have at least one room.")
    if hotel_data['revenue_generated'] < 0:
        raise ValueError("Revenue cannot be negative.")
    return True

def validate_reservation_data(reservation_data):
    if reservation_data['amount'] <= 0:
        raise ValueError("Reservation amount must be greater than zero.")
    if reservation_data['check_in_date'] >= reservation_data['check_out_date']:
        raise ValueError("Check-out date must be later than check-in date.")
    return True

def validate_complaint_data(complaint_data):
    if len(complaint_data['complaint_description']) == 0:
        raise ValueError("Complaint description cannot be empty.")
    if complaint_data['resolved'] not in [True, False]:
        raise ValueError("Complaint resolved status must be a boolean value.")
    return True

def validate_invoice_data(invoice_data):
    if invoice_data['net_amount'] <= 0:
        raise ValueError("Invoice net amount must be greater than zero.")
    if invoice_data['gross_amount'] < invoice_data['net_amount']:
        raise ValueError("Gross amount cannot be less than net amount.")
    return True

def validate_inventory_data(inventory_data):
    if inventory_data['quantity'] < 0:
        raise ValueError("Inventory quantity cannot be negative.")
    return True

def seed_data():
    hotel = create_hotel()
    room = create_room(hotel)
    reservation = create_reservation(hotel, room)
    staff = create_staff(hotel)
    complaint = create_complaint(hotel)
    guest = create_guest()
    booking = create_booking(guest, hotel, room)
    invoice = create_invoice(guest, hotel)
    invoice_item = create_invoice_item(invoice)
    inventory = create_inventory(hotel)
    report = create_report(hotel)
    channel = create_communication_channel(hotel)
    message = create_message(channel)

    # Validation checks
    validate_hotel_data({
        'name': hotel.name,
        'total_rooms': hotel.total_rooms,
        'revenue_generated': hotel.revenue_generated
    })
    validate_reservation_data({
        'amount': reservation.amount,
        'check_in_date': reservation.check_in_date,
        'check_out_date': reservation.check_out_date
    })
    validate_complaint_data({
        'complaint_description': complaint.complaint_description,
        'resolved': complaint.resolved
    })
    validate_invoice_data({
        'net_amount': invoice.net_amount,
        'gross_amount': invoice.gross_amount
    })
    validate_inventory_data({
        'quantity': inventory.quantity
    })

if __name__ == "__main__":
    seed_data() #This will execute your seed function
