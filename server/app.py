from flask import Flask, redirect, request, jsonify, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO # type: ignore
from flask_mail import Mail, Message
from flask_cors import CORS
import os
from datetime import datetime
import random
import string
import requests
from sqlalchemy import func
from models import db, HotelRevenue, BookingSource, OccupancyRate, Hotel, Room, Reservation, Staff, Notification, Hotel, Guest, Reservation, Room, Payment, Invoice, Hotel, Invoice, Expense, POSItem, POSTransaction, Employee, NextOfKin, Staff, Complaint
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from requests_oauthlib import OAuth2Session # type: ignore
from flask import session
import stripe # type: ignore

app = Flask(__name__)
app.config ['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/hotel_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
mail = Mail(app)

db.init_app(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
jwt = JWTManager(app)


# Define your Xero app credentials
XERO_CLIENT_ID = 'your_client_id'
XERO_CLIENT_SECRET = 'your_client_secret'
XERO_REDIRECT_URI = 'your_redirect_uri'

# OAuth2 session
xero = OAuth2Session(XERO_CLIENT_ID)

#new staff blueprint
staff_routes = Blueprint('staff', __name__)


#Dashboard 1

@app.route('/api/revenue', methods = ['GET'])
def get_revenue():
    hotel_id = request.args.get('hotel_id')
    date = request.args.get('date')
    revenue = HotelRevenue.query.filter_by(hotel_id=hotel_id, date=date).first()
    return jsonify(
        revenue.serialize()
    ) if revenue else {}


@app.route('/api/booking-source', methods = ['GET'])
def get_booking_source():
    hotel_id = request.args.get('hotel_id')
    source = BookingSource.query.filter_by(hotel_id=hotel_id).first()
    return jsonify(source.serialize()) if source else {}


@app.route('/api/occupancy', methods = ['GET'])
def get_occupancy_rate():
    hotel_id = request.args.get('hotel_id')
    date = request.args.get('date')
    rate = OccupancyRate.query.filter_by(hotel_id=hotel_id).first()

    return jsonify(rate.serialize()) if rate else {}


#real-time data
@socketio.on('request_data')
def handle_request_data(data):
    hotel_id = data['hotel_id']
    latest_data = get_latest_data(hotel_id)  # This should fetch the latest data
    socketio.emit('update_data', latest_data)

def get_latest_data(hotel_id):
    #custom function to get all relevant data for the hotel
    revenue = HotelRevenue.query.filter_by(hotel_id=hotel_id).all()
    booking_source = BookingSource.query.filter_by(hotel_id=hotel_id).first()
    occupancy = OccupancyRate.query.filter_by(hotel_id=hotel_id).all()

    return{
        'revenue': [rev.serialize() for rev in revenue],
        'booking_source': booking_source.serialize() if booking_source else {},
        'occupancy': [occ.serialize() for occ in occupancy],
    }

#reservations part

@app.route('/api/rooms/availability', methods=['GET'])
def check_availability():
    room_type = request.args.get('room_type')
    check_in_date = datetime.strptime(request.args.get('check_in_date'), '%Y-%m-%d')
    check_out_date = datetime.strptime(request.args.get('check_out_date'), '%Y-%m-%d')
    no_of_rooms = int(request.args.get('no_of_rooms'))

    reservations = Reservation.query.filter(
        Reservation.room_type == room_type,
        Reservation.check_in_date < check_out_date,
        Reservation.check_out_date > check_in_date
    ).all()

    if len(reservations) + no_of_rooms > total_rooms:  # type: ignore # Assume total_rooms is defined
        return jsonify({"available": False}), 200
    
    return jsonify({"available": True}), 200

@app.route('/api/reservations', methods=['POST'])
def make_reservation():
    data = request.json
    hotel_id = data.get('hotel_id')
    required_fields = ["room_type", "room_number", "check_in_date", "check_out_date", "no_of_rooms",
                       "no_of_children", "no_of_adults", "amount", "first_name", "last_name", "email",
                       "home_address", "telephone"]

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "All fields are required"}), 400

    # Check for existing reservations that overlap
    existing_reservations = Reservation.query.filter(
        Reservation.room_type == data["room_type"],
        Reservation.check_in_date < datetime.strptime(data["check_out_date"], '%Y-%m-%d'),
        Reservation.check_out_date > datetime.strptime(data["check_in_date"], '%Y-%m-%d')
    ).all()

    if existing_reservations:
        return jsonify({"error": "Room is already booked for the selected dates."}), 400

    reservation = Reservation(
        hotel_id=hotel_id,
        room_type=data["room_type"],
        room_number=data["room_number"],
        check_in_date=datetime.strptime(data["check_in_date"], '%Y-%m-%d'),
        check_out_date=datetime.strptime(data["check_out_date"], '%Y-%m-%d'),
        no_of_rooms=data["no_of_rooms"],
        no_of_children=data["no_of_children"],
        no_of_adults=data["no_of_adults"],
        amount=data["amount"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        home_address=data["home_address"],
        telephone=data["telephone"]
    )
    db.session.add(reservation)
    db.session.commit()

    # Send confirmation email
    msg = Message(f"Booking Confirmation for {reservation.first_name}",
                  recipients=[reservation.email])
    msg.body = f"Dear {reservation.first_name},\n\nYour booking is confirmed.\n\nDetails:\nRoom Type: {reservation.room_type}\nRoom Number: {reservation.room_number}\nCheck-in: {reservation.check_in_date}\nCheck-out: {reservation.check_out_date}\nTotal Amount: ${reservation.amount}\n\nThank you for choosing our hotel!"
    mail.send(msg)

    return jsonify({"message": "Reservation successful!"}), 201

@app.route('/api/reservations/<int:reservation_id>', methods=['DELETE'])
def cancel_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reservation not found"}), 404
    
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({"message": "Reservation canceled successfully"}), 200


#dashboard1
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    hotel_id = get_jwt_identity()
    data = {
        'total_rooms': Room.query.filter_by(hotel_id=hotel_id).count(),
        'total_reservations': Reservation.query.filter_by(hotel_id=hotel_id).count(),
        'number_of_staff': Staff.query.filter_by(hotel_id=hotel_id).count(),
        'booked_rooms': Room.query.filter_by(hotel_id=hotel_id, is_available=False).count(),
        'available_rooms': Room.query.filter_by(hotel_id=hotel_id, is_available=True).count(),
        'checked_in_clients': Reservation.query.filter_by(hotel_id=hotel_id, is_checked_in=True).count(),
        'checkouts_today': Reservation.query.filter_by(hotel_id=hotel_id).filter(func.date(Reservation.check_out_date) == func.date(func.now())).count(),
        'pending_payments': Reservation.query.filter_by(hotel_id=hotel_id, is_paid=False).count(),
        'total_revenue': Hotel.query.filter_by(id=hotel_id).first().revenue_generated,
        'notifications': [n.message for n in Notification.query.filter_by(hotel_id=hotel_id).order_by(Notification.created_at.desc()).all()]
    }
    return jsonify(data)

#manage rooms
@app.route('/rooms', methods=['GET'])
def get_rooms():
    hotel_id = request.args.get('hotel_id')  # Assume this comes from the authenticated user
    rooms = Room.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([room.to_dict() for room in rooms])  # Add a to_dict method in the Room model

@app.route('/rooms/checkin/<int:id>', methods=['POST'])
def checkin_room(id):
    room = Room.query.get_or_404(id)
    data = request.json

    if room.booking_status:
        return jsonify({'error': 'Room is already booked.'}), 400

    room.customer_name = data['customer_name']
    room.contact_number = data['contact_number']
    room.email = data['email']
    room.home_address = data['home_address']
    room.checkin_date = data['checkin_date']
    room.checkout_date = data['checkout_date']
    room.total_price = data['total_price']
    room.advance_payment = data['advance_payment']
    room.remaining_amount = room.total_price - room.advance_payment
    room.booking_status = True

    db.session.commit()
    return jsonify({'message': 'Check-in successful!'})

@app.route('/rooms/checkout/<int:id>', methods=['POST'])
def checkout_room(id):
    room = Room.query.get_or_404(id)
    data = request.json

    if not room.booking_status:
        return jsonify({'error': 'Room is not booked.'}), 400

    room.remaining_amount -= data['payment_amount']

    if room.remaining_amount <= 0:
        room.booking_status = False
        room.customer_name = None
        room.contact_number = None
        room.email = None
        room.home_address = None
        room.checkin_date = None
        room.checkout_date = None
        room.total_price = None
        room.advance_payment = None
        room.remaining_amount = None

    db.session.commit()
    return jsonify({'message': 'Checkout successful!'})

@app.route('/rooms', methods=['POST'])
def add_room():
    data = request.json
    new_room = Room(
        room_number=data['room_number'],
        room_type=data['room_type'],
        hotel_id=data['hotel_id']
    )
    db.session.add(new_room)
    db.session.commit()
    return jsonify({'message': 'Room added successfully!'}), 201

#new staff
@staff_routes.route('/create_staff', methods=['POST'])
def create_employee():
    data = request.json
    try:
        employee = Staff(
            hotel_id=data['hotel_id'],
            first_name=data['first_name'],
            middle_name=data.get('middle_name', ''),
            last_name=data['last_name'],
            id_card_type=data['id_card_type'],
            id_card_number=data['id_card_number'],
            contact_number=data['contact_number'],
            email=data['email'],
            residence=data['residence'],
            role=data['role'],
            shift_type=data['shift_type'],
            salary=data['salary']
        )
        db.session.add(employee)
        db.session.commit()

        next_of_kin = NextOfKin(
            employee_id=employee.id,
            first_name=data['next_of_kin']['first_name'],
            last_name=data['next_of_kin']['last_name'],
            relation=data['next_of_kin']['relation'],
            contact_number=data['next_of_kin']['contact_number'],
            email=data['next_of_kin']['email'],
            residence=data['next_of_kin']['residence']
        )
        db.session.add(next_of_kin)
        db.session.commit()
        return jsonify({"message": "Employee created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@staff_routes.route('/staff/<int:hotel_id>', methods=['GET'])
def get_employees(hotel_id):
    staff = Staff.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([employee.to_dict() for employee in staff])

#manage staff
@app.route('/api/staff', methods=['GET'])
def get_staff():
    hotel_id = request.args.get('hotel_id')
    staff = Staff.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'phone_number': s.phone_number,
        'address': s.address,
        'role': s.role,
        'shift': s.shift,
        'joining_date': s.joining_date,
        'next_of_kin_name': s.next_of_kin_name,
        'next_of_kin_phone': s.next_of_kin_phone,
        'salary': s.salary
    } for s in staff])

@app.route('/api/staff', methods=['POST'])
def add_staff():
    data = request.json
    new_staff = Staff(**data)
    db.session.add(new_staff)
    db.session.commit()
    return jsonify({'message': 'Staff added successfully'}), 201

@app.route('/api/staff/<int:id>', methods=['PUT'])
def update_staff(id):
    data = request.json
    staff = Staff.query.get_or_404(id)
    for key, value in data.items():
        setattr(staff, key, value)
    db.session.commit()
    return jsonify({'message': 'Staff updated successfully'})

@app.route('/api/staff/<int:id>', methods=['DELETE'])
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    return jsonify({'message': 'Staff deleted successfully'})

#manage complaints
@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    data = request.json
    new_complaint = Complaint(
        hotel_id=data['hotel_id'],
        complainant_name=data['complainant_name'],
        complaint_type=data['complaint_type'],
        complaint_description=data['complaint_description']
    )
    db.session.add(new_complaint)
    db.session.commit()
    return jsonify({"message": "Complaint submitted successfully"}), 201

@app.route('/api/complaints/<int:hotel_id>', methods=['GET'])
def get_complaints(hotel_id):
    complaints = Complaint.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([{
        "id": c.id,
        "complainant_name": c.complainant_name,
        "complaint_type": c.complaint_type,
        "complaint_description": c.complaint_description,
        "created_on": c.created_on,
        "resolved": c.resolved,
        "budget": c.budget,
        "resolved_on": c.resolved_on
    } for c in complaints])

@app.route('/api/complaints/resolve/<int:id>', methods=['PUT'])
def resolve_complaint(id):
    data = request.json
    complaint = Complaint.query.get(id)
    if complaint:
        complaint.resolved = True
        complaint.budget = data['budget']
        complaint.resolved_on = datetime.now()
        db.session.commit()
        return jsonify({"message": "Complaint resolved successfully"}), 200
    return jsonify({"message": "Complaint not found"}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables
    app.run(debug=True)
if __name__ == '__main__':
    socketio.run(app, debug=True)