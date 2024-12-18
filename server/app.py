import csv
from io import BytesIO
import io
import bcrypt
from flask import Flask, redirect, request, jsonify, Blueprint, send_file
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO # type: ignore
from flask_mail import Mail, Message
from flask_cors import CORS
from flask_migrate import Migrate
import os
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import uuid
import pandas as pd # type: ignore
from fpdf import FPDF # type: ignore
#import random
#import string
#import requests
from sqlalchemy import func
from models import Category, CommunicationChannel, Inventory, Order, Report, Revenue, Service, db, Room, Reservation, Staff, Hotel, Guest, Payment, NextOfKin, Complaint
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from requests_oauthlib import OAuth2Session # type: ignore
from flask import session
#import stripe # type: ignore

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://Kariuki:admin123@localhost/hotelmanagement'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=20)
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # Set True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
mail = Mail(app)

limiter = Limiter(get_remote_address, app=app,)
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="*")
jwt = JWTManager(app)
migrate = Migrate(app, db)


# Define your Xero app credentials
XERO_CLIENT_ID = 'your_client_id'
XERO_CLIENT_SECRET = 'your_client_secret'
XERO_REDIRECT_URI = 'your_redirect_uri'

# OAuth2 session
xero = OAuth2Session(XERO_CLIENT_ID)

#new staff blueprint / housekeeping blueprint
staff_routes = Blueprint('staff', __name__)
housekeeping_routes = Blueprint('housekeeping', __name__)


#Dashboard 1

# Example initial data
data = {
    "total_rooms": 120,
    "total_reservations": 85,
    "number_of_staff": 20,
    "booked_rooms": 75,
    "available_rooms": 45,
    "checked_in_clients": 30,
    "checkouts_today": 10,
    "pending_payments": 50000,
    "total_revenue": 200000,
}
@app.route('/')
def home():
    return 'Hello, User!'

@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    return jsonify(data)

# Endpoint to simulate data updates
@app.route('/update', methods=['POST'])
def update_dashboard():
    global data
    # Simulate data update logic here
    data["booked_rooms"] -= 1
    data["available_rooms"] += 1
    socketio.emit('dashboard_update', data)  # Push updated data to clients
    return jsonify({"message": "Data updated successfully!"}), 200

"""@app.route('/api/revenue', methods = ['GET'])
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
    }"""

#reservations part

@app.route('/rooms', methods=['GET', 'POST'])
def handle_rooms():
    if request.method == 'POST':
        data = request.get_json()
        new_room = Room(
            hotel_id=data['hotel_id'],
            room_number=data['room_number'],
            room_type=data['room_type'],
            booking_status=data.get('booking_status', False)
        )
        db.session.add(new_room)
        db.session.commit()
        return jsonify({'message': 'Room added successfully'}), 201
    else:
        hotel_id = request.args.get('hotel_id')
        rooms = Room.query.filter_by(hotel_id=hotel_id).all()
        room_list = [{'id': room.id, 'room_number': room.room_number, 'room_type': room.room_type, 'booking_status': room.booking_status} for room in rooms]
        return jsonify(room_list)

@app.route('/rooms/availability', methods=['GET'])
def check_availability():
    room_type = request.args.get('room_type')
    check_in_date = datetime.strptime(request.args.get('check_in_date'), '%Y-%m-%d')
    check_out_date = datetime.strptime(request.args.get('check_out_date'), '%Y-%m-%d')
    no_of_rooms = int(request.args.get('no_of_rooms'))

    available_rooms = Room.query.filter_by(room_type=room_type, booking_status=False).all()
    if len(available_rooms) >= no_of_rooms:
        available_room_ids = [room.id for room in available_rooms[:no_of_rooms]]
        return jsonify({'available': True, 'room_ids': available_room_ids})
    else:
        return jsonify({'available': False, 'room_ids': []})

@app.route('/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    new_reservation = Reservation(
        hotel_id=data['hotel_id'],
        room_type=data['room_type'],
        room_number=data['room_number'],
        check_in_date=datetime.strptime(data['check_in_date'], '%Y-%m-%d'),
        check_out_date=datetime.strptime(data['check_out_date'], '%Y-%m-%d'),
        no_of_rooms=data['no_of_rooms'],
        no_of_adults=data['no_of_adults'],
        no_of_children=data['no_of_children'],
        amount=data['amount'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        home_address=data['home_address'],
        telephone=data['telephone'],
        status="Reserved"
    )
    # Mark rooms as booked
    rooms_to_book = Room.query.filter(Room.id.in_(data.get('room_ids', []))).all()
    for room in rooms_to_book:
        room.booking_status = True
    db.session.add(new_reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation created successfully'}), 201

@app.route('/reservations', methods=['GET'])
def get_reservations():
    hotel_id = request.args.get('hotel_id')
    status = request.args.get('status', 'Reserved')
    reservations = Reservation.query.filter_by(hotel_id=hotel_id, status=status).all()
    reservation_list = [{
        'id': res.id,
        'first_name': res.first_name,
        'last_name': res.last_name,
        'room_type': res.room_type,
        'room_number': res.room_number,
        'check_in_date': res.check_in_date.strftime('%Y-%m-%d'),
        'check_out_date': res.check_out_date.strftime('%Y-%m-%d'),
        'amount': res.amount,
        'status': res.status
    } for res in reservations]
    return jsonify(reservation_list)

@app.route('/reservations/<int:id>/checkout', methods=['POST'])
def check_out(id):
    reservation = Reservation.query.get(id)
    if reservation:
        reservation.status = "Checked Out"
        # Free up the room
        room = Room.query.filter_by(room_number=reservation.room_number, hotel_id=reservation.hotel_id).first()
        if room:
            room.booking_status = False
        db.session.commit()
        return jsonify({'message': 'Checked out successfully'})
    return jsonify({'message': 'Reservation not found'}), 404

#front desk 
@app.route('/api/front_desk_data', methods=['GET'])
def get_front_desk_data():
    hotel_id = request.args.get('hotel_id')
    
    # Retrieve all rooms
    rooms = Room.query.filter_by(hotel_id=hotel_id).all()
    
    # Retrieve all reservations
    reservations = Reservation.query.filter_by(hotel_id=hotel_id).all()
    
    # Filter options
    filter_options = {
        'housekeeping': ["cleaning", "clean", "dirty", "out of service"],
        'facilities': ["fireplace", "hot tub", "balcony"],
        'room_types': ["single", "double", "suite"],
        'booking_options': ["deal", "self check-in", "self check-out", "early check-in", "late check-out"]
    }

    return jsonify({
        'rooms': [room.to_dict() for room in rooms],
        'reservations': [res.to_dict() for res in reservations],
        'filter_options': filter_options
    })

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

#new staff & manage staff
# Route to fetch all staff for a specific hotel
@app.route('/api/staff', methods=['GET'])
def get_staff():
    hotel_id = request.args.get('hotel_id')
    staff = Staff.query.filter_by(hotel_id=hotel_id).all()
    staff_list = [{
        'id': s.id,
        'name': s.name,
        'phone_number': s.phone_number,
        'address': s.address,
        'role': s.role,
        'shift': s.shift,
        'joining_date': s.joining_date.strftime('%Y-%m-%d'),
        'next_of_kin_name': s.next_of_kin_name,
        'next_of_kin_phone': s.next_of_kin_phone,
        'salary': str(s.salary)
    } for s in staff]
    return jsonify(staff_list)

# Route to add a new staff member
@app.route('/api/staff', methods=['POST'])
def add_staff():
    data = request.get_json()
    new_staff = Staff(
        hotel_id=data['hotel_id'],
        name=data['name'],
        phone_number=data['phone_number'],
        address=data.get('address'),
        role=data['role'],
        shift=data['shift'],
        joining_date=datetime.strptime(data['joining_date'], '%Y-%m-%d'),
        next_of_kin_name=data['next_of_kin_name'],
        next_of_kin_phone=data['next_of_kin_phone'],
        salary=data['salary']
    )
    db.session.add(new_staff)
    db.session.commit()
    return jsonify({'message': 'Staff added successfully'}), 201

# Route to delete a staff member by ID
@app.route('/api/staff/<int:id>', methods=['DELETE'])
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    return jsonify({'message': 'Staff deleted successfully'}), 200

# Route to update a staff member's details by ID
@app.route('/api/update_staff/<int:id>', methods=['PUT'])
def update_staff(id):
    staff = Staff.query.get_or_404(id)
    data = request.get_json()

    staff.name = data.get('name', staff.name)
    staff.phone_number = data.get('phone_number', staff.phone_number)
    staff.address = data.get('address', staff.address)
    staff.role = data.get('role', staff.role)
    staff.shift = data.get('shift', staff.shift)
    staff.joining_date = datetime.strptime(data['joining_date'], '%Y-%m-%d') if 'joining_date' in data else staff.joining_date
    staff.next_of_kin_name = data.get('next_of_kin_name', staff.next_of_kin_name)
    staff.next_of_kin_phone = data.get('next_of_kin_phone', staff.next_of_kin_phone)
    staff.salary = data.get('salary', staff.salary)

    db.session.commit()
    return jsonify({'message': 'Staff updated successfully'}), 200

# Route to change a staff member's shift
@app.route('/api/staff/<int:id>/shift', methods=['PATCH'])
def change_shift(id):
    staff = Staff.query.get_or_404(id)
    data = request.get_json()
    staff.shift = data['shift']
    db.session.commit()
    return jsonify({'message': 'Shift updated successfully'}), 200

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

#communication

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    hotel_id = data['hotel_id']
    channel_type = data['channel_type']
    sender_type = data['sender_type']
    sender_id = data['sender_id']
    recipient_id = data['recipient_id']
    subject = data['subject']
    message = data['message']

    # Create a communication channel if not exists
    channel = CommunicationChannel.query.filter_by(hotel_id=hotel_id, type=channel_type).first()
    if not channel:
        channel = CommunicationChannel(hotel_id=hotel_id, type=channel_type)
        db.session.add(channel)
        db.session.commit()

    # Create the message
    new_message = Message(
        channel_id=channel.id,
        sender_type=sender_type,
        sender_id=sender_id,
        recipient_id=recipient_id,
        subject=subject,
        message=message
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify({"status": "success", "message": "Message sent successfully"}), 200

@app.route('/get_messages/<hotel_id>', methods=['GET'])
def get_messages(hotel_id):
    messages = Message.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([message.to_dict() for message in messages]), 200

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    results = []

    if query:
        # Simulate searching in guests and employees
        guests = Reservation.query.filter(Reservation.guest_name.like(f"%{query}%")).all()
        employees = Hotel.query.filter(Hotel.name.like(f"%{query}%")).all()

        # Combine results
        results = [{"id": g.id, "name": g.guest_name, "email": g.guest_email} for g in guests] + \
                  [{"id": e.id, "name": e.name, "email": e.email} for e in employees]

    return jsonify(results)

#add guest
@app.route('/add_guest', methods=['POST'])
def add_guest():
    data = request.json
    guest_id = str(uuid.uuid4())[:8]  # Generate unique guest ID
    new_guest = Guest(
        first_name=data['first_name'],
        last_name=data['last_name'],
        nationality=data['nationality'],
        language=data['language'],
        guest_id=guest_id,
        date_of_birth=data['date_of_birth'],
        phone_number=data['phone_number'],
        email=data['email'],
        country=data['country'],
        region=data['region'],
        city=data['city'],
        address=data['address'],
        zip_code=data['zip_code'],
        id_card_type=data['id_card_type'],
        id_card_number=data['id_card_number']
    )
    db.session.add(new_guest)
    db.session.commit()
    return jsonify({"message": "Guest added successfully", "guest_id": guest_id}), 201

@app.route('/guests', methods=['GET'])
def get_guests():
    guests = Guest.query.all()
    guest_list = [{
        "id": guest.id,
        "first_name": guest.first_name,
        "last_name": guest.last_name,
        "guest_id": guest.guest_id,
        "created_at": guest.created_at
    } for guest in guests]
    return jsonify(guest_list)

@app.route('/guest/<int:guest_id>', methods=['GET'])
def get_guest(guest_id):
    guest = Guest.query.get(guest_id)
    services = Service.query.filter_by(guest_id=guest.id).all()
    payments = Payment.query.filter_by(guest_id=guest.id).all()
    return jsonify({
        "guest_info": {
            "name": f"{guest.first_name} {guest.last_name}",
            "email": guest.email,
            "phone": guest.phone_number,
            # additional fields as needed
        },
        "services": [{"description": s.description, "amount": s.amount} for s in services],
        "payments": [{"amount_due": p.amount_due, "amount_paid": p.amount_paid, "pending_amount": p.pending_amount} for p in payments]
    })

#guest report
@app.route('/generate_guest_report', methods=['POST'])
def generate_guest_report():
    try:
        data = request.get_json()
        hotel_id = data.get("hotel_id")
        report_type = data.get("report_type")  # e.g., daily, weekly, monthly, yearly
        export_format = data.get("export_format")  # e.g., 'pdf', 'csv', 'excel'

        # Fetch data for the report
        guests = Guest.query.filter_by(hotel_id=hotel_id).all()
        revenue = Revenue.query.filter_by(hotel_id=hotel_id).all()

        guest_data = [{
            "Guest Name": f"{guest.first_name} {guest.last_name}",
            "Date of Booking": guest.created_at.strftime("%Y-%m-%d"),
            "Charges": guest.total_charges,
            "Amount Paid": guest.amount_paid,
            "Pending Balance": guest.pending_balance
        } for guest in guests]

        revenue_data = [{
            "Date": rev.date.strftime("%Y-%m-%d"),
            "Revenue": rev.amount
        } for rev in revenue]

        # Combine data into a DataFrame for processing
        df_guests = pd.DataFrame(guest_data)
        df_revenue = pd.DataFrame(revenue_data)

        # Export based on user format
        if export_format == 'csv':
            df_guests.to_csv('guests_report.csv', index=False)
            return send_file('guests_report.csv', as_attachment=True)
        elif export_format == 'excel':
            writer = pd.ExcelWriter('report.xlsx', engine='xlsxwriter')
            df_guests.to_excel(writer, sheet_name='Guests', index=False)
            df_revenue.to_excel(writer, sheet_name='Revenue', index=False)
            writer.save()
            return send_file('report.xlsx', as_attachment=True)
        elif export_format == 'pdf':
            
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            pdf.cell(200, 10, txt="Guest Report", ln=True, align='C')
            for _, row in df_guests.iterrows():
                pdf.cell(200, 10, txt=str(row.to_dict()), ln=True)
            pdf.output("report.pdf")
            return send_file('report.pdf', as_attachment=True)

        return jsonify({"message": "Invalid format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# housekeeping
@housekeeping_routes.route('/housekeeping/rooms', methods=['GET'])
@jwt_required()
def get_rooms():
    hotel_id = get_jwt_identity()  # Auth token should provide hotel_id
    rooms = Room.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([{
        'id': room.id,
        'room_number': room.room_number,
        'room_type': room.room_type,
        'housekeeping_status': room.housekeeping_status,
        'priority': room.priority,
        'reservation_status': room.reservation_status,
        'comments': room.comments
    } for room in rooms])

@housekeeping_routes.route('/housekeeping/rooms', methods=['POST'])
@jwt_required()
def add_room():
    data = request.get_json()
    hotel_id = get_jwt_identity()
    new_room = Room(
        hotel_id=hotel_id,
        room_number=data['room_number'],
        room_type=data['room_type'],
        housekeeping_status=data['housekeeping_status'],
        priority=data['priority'],
        reservation_status=data.get('reservation_status'),
        comments=data.get('comments')
    )
    db.session.add(new_room)
    db.session.commit()
    return jsonify({'message': 'Room added successfully'}), 201

@housekeeping_routes.route('/housekeeping/rooms/<int:id>', methods=['PUT'])
@jwt_required()
def update_room(id):
    data = request.get_json()
    hotel_id = get_jwt_identity()
    room = Room.query.filter_by(id=id, hotel_id=hotel_id).first()
    if room:
        room.room_number = data.get('room_number', room.room_number)
        room.room_type = data.get('room_type', room.room_type)
        room.housekeeping_status = data.get('housekeeping_status', room.housekeeping_status)
        room.priority = data.get('priority', room.priority)
        room.reservation_status = data.get('reservation_status', room.reservation_status)
        room.comments = data.get('comments', room.comments)
        db.session.commit()
        return jsonify({'message': 'Room updated successfully'}), 200
    return jsonify({'message': 'Room not found'}), 404

#inventory

# Create models table if not exists
"""cursor = db.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    description TEXT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);
''')
db.commit()

@app.route('/inventory/<int:hotel_id>', methods=['GET'])
def get_inventory(hotel_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM inventory WHERE hotel_id = %s", (hotel_id,))
    inventory = cursor.fetchall()
    return jsonify(inventory)

@app.route('/inventory', methods=['POST'])
def add_item():
    data = request.json
    hotel_id = data.get('hotel_id')
    item_name = data.get('item_name')
    quantity = data.get('quantity')
    description = data.get('description', '')

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO inventory (hotel_id, item_name, quantity, description) VALUES (%s, %s, %s, %s)",
        (hotel_id, item_name, quantity, description)
    )
    db.commit()
    return jsonify({'message': 'Item added successfully!'}), 201

@app.route('/inventory/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM inventory WHERE id = %s", (item_id,))
    db.commit()
    return jsonify({'message': 'Item deleted successfully!'})

@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    item_name = data.get('item_name')
    quantity = data.get('quantity')
    description = data.get('description', '')

    cursor = db.cursor()
    cursor.execute(
        "UPDATE inventory SET item_name = %s, quantity = %s, description = %s WHERE id = %s",
        (item_name, quantity, description, item_id)
    )
    db.commit()
    return jsonify({'message': 'Item updated successfully!'})"""

# Get inventory for a specific hotel
@app.route('/inventory/<int:hotel_id>', methods=['GET'])
def get_inventory(hotel_id):
    inventory = Inventory.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([{
        'id': item.id,
        'hotel_id': item.hotel_id,
        'item_name': item.item_name,
        'quantity': item.quantity,
        'description': item.description
    } for item in inventory])

# Add a new inventory item
@app.route('/inventory', methods=['POST'])
def add_item():
    data = request.json
    hotel_id = data.get('hotel_id')
    item_name = data.get('item_name')
    quantity = data.get('quantity')
    description = data.get('description', '')

    new_item = Inventory(hotel_id=hotel_id, item_name=item_name, quantity=quantity, description=description)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({'message': 'Item added successfully!'}), 201

# Delete an inventory item
@app.route('/inventory/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = Inventory.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()

    return jsonify({'message': 'Item deleted successfully!'})

# Update an inventory item
@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    item = Inventory.query.get_or_404(item_id)

    item.item_name = data.get('item_name', item.item_name)
    item.quantity = data.get('quantity', item.quantity)
    item.description = data.get('description', item.description)

    db.session.commit()

    return jsonify({'message': 'Item updated successfully!'})    

#inventory report
@app.route('/api/inventory/<int:hotel_id>/report', methods=['GET'])
def generate_inventory_report(hotel_id):
    # Fetch inventory data for the hotel
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Inventory.query.filter(Inventory.hotel_id == hotel_id)
    if start_date:
        query = query.filter(Inventory.last_updated >= start_date)
    if end_date:
        query = query.filter(Inventory.last_updated <= end_date)
    
    inventory_data = query.all()
    report = [
        {
            "item_name": item.item_name,
            "quantity": item.quantity,
            "description": item.description,
            "last_updated": item.last_updated.strftime('%Y-%m-%d'),
        }
        for item in inventory_data
    ]
    return jsonify(report)

@app.route('/api/inventory/<int:hotel_id>/export/<format>', methods=['GET'])
def export_inventory_report(hotel_id, format):
    query = Inventory.query.filter(Inventory.hotel_id == hotel_id)
    inventory_data = query.all()

    data = [
        {"Item Name": item.item_name, "Quantity": item.quantity, "Description": item.description,
         "Last Updated": item.last_updated.strftime('%Y-%m-%d')}
        for item in inventory_data
    ]
    df = pd.DataFrame(data)
    filename = f"inventory_report_{hotel_id}_{datetime.now().strftime('%Y%m%d')}.{format}"

    if format == "csv":
        df.to_csv(filename, index=False)
    elif format == "xlsx":
        df.to_excel(filename, index=False)
    elif format == "pdf":
        df.to_csv('temp.csv', index=False)  # Generate CSV and then convert to PDF.
        os.system(f"csv2pdf temp.csv {filename}")
        os.remove('temp.csv')

    return send_file(filename, as_attachment=True)

#login & logout & change password

SECRET_KEY = 'your_jwt_secret'
# Dummy credentials for sample purposes
DUMMY_CREDENTIALS = {
    "admin": "password123",
    "user": "user123"
}
def generate_jwt(hotel_id):
    expiration = datetime.datetime.utcnow() + timedelta(minutes=20)
    token = jwt.encode({'hotel_id': hotel_id, 'exp': expiration}, SECRET_KEY, algorithm='HS256')
    return token

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.json
    username = data['name']
    password = data['password']

    # Check Dummy Credentials First
    if username in DUMMY_CREDENTIALS and DUMMY_CREDENTIALS[username] == password:
        token = generate_jwt(f"dummy-{username}")
        return jsonify({"message": f"Welcome {username}!", "token": token})

    # Check Database Credentials if not found in Dummy
    hotel = Hotel.query.filter_by(name=username).first()
    if hotel and check_password_hash(hotel.password, password):
        token = generate_jwt(hotel.id)
        return jsonify({"message": "Login successful", "token": token})

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('hotel_id', None)
    return jsonify({"message": "Logged out successfully"})

@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing"}), 401
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return jsonify({"message": "Authorized access", "hotel_id": data['hotel_id']})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.json
    username = data.get('username')
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    user = Staff.query.filter_by(username=username).first()
    if user and bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
        user.password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.session.commit()
        return jsonify({"success": True, "message": "Password changed successfully."})
    return jsonify({"success": False, "message": "Invalid credentials or user not found."}), 401

#order report
@app.route('/api/orders/report', methods=['GET'])
def generate_order_report():
    hotel_id = request.args.get('hotel_id')
    report_type = request.args.get('report_type', 'daily')
    start_date = request.args.get('start_date', None)
    end_date = request.args.get('end_date', None)

    # Query orders based on hotel ID and date range
    query = Order.query.filter_by(hotel_id=hotel_id)

    if start_date and end_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        query = query.filter(Order.created_on >= start_date, Order.created_on <= end_date)
    
    orders = query.all()

    total_revenue = sum(order.amount for order in orders)
    total_expenses = 0  # You could calculate expenses if you have them stored
    total_profit = total_revenue - total_expenses

    # Save the report in the database
    report = Report(
        hotel_id=hotel_id,
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        total_profit=total_profit,
        report_type=report_type
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({
        'total_revenue': total_revenue,
        'total_expenses': total_expenses,
        'total_profit': total_profit,
        'report_type': report_type,
    })


@app.route('/api/orders/report/export', methods=['GET'])
def export_report():
    hotel_id = request.args.get('hotel_id')
    report_type = request.args.get('report_type')
    report_format = request.args.get('format', 'csv')

    # Fetch the report data from the database
    report = Report.query.filter_by(hotel_id=hotel_id, report_type=report_type).first()

    if not report:
        return jsonify({'error': 'Report not found'}), 404

    # Generate and export the report in the desired format
    if report_format == 'csv':
        return export_to_csv(report)
    elif report_format == 'xlsx':
        return export_to_excel(report)
    elif report_format == 'pdf':
        return export_to_pdf(report)
    else:
        return jsonify({'error': 'Invalid format'}), 400


def export_to_csv(report):
    # Convert data to CSV
    data = [
        ['Hotel ID', 'Total Revenue', 'Total Expenses', 'Total Profit', 'Report Type', 'Created On'],
        [report.hotel_id, report.total_revenue, report.total_expenses, report.total_profit, report.report_type, report.created_on],
    ]
    filename = f'report_{report.hotel_id}.csv'

    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(data)

    return send_file(filename, as_attachment=True)


def export_to_excel(report):
    # Convert data to Excel using Pandas
    data = {
        'Hotel ID': [report.hotel_id],
        'Total Revenue': [report.total_revenue],
        'Total Expenses': [report.total_expenses],
        'Total Profit': [report.total_profit],
        'Report Type': [report.report_type],
        'Created On': [report.created_on],
    }
    df = pd.DataFrame(data)
    filename = f'report_{report.hotel_id}.xlsx'
    df.to_excel(filename, index=False)

    return send_file(filename, as_attachment=True)


def export_to_pdf(report):
    # Create a simple PDF report
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(200, 10, 'Hotel Report', ln=True, align='C')
    pdf.ln(10)

    pdf.set_font('Arial', '', 12)
    pdf.cell(200, 10, f'Hotel ID: {report.hotel_id}', ln=True)
    pdf.cell(200, 10, f'Total Revenue: {report.total_revenue}', ln=True)
    pdf.cell(200, 10, f'Total Expenses: {report.total_expenses}', ln=True)
    pdf.cell(200, 10, f'Total Profit: {report.total_profit}', ln=True)
    pdf.cell(200, 10, f'Report Type: {report.report_type}', ln=True)
    pdf.cell(200, 10, f'Created On: {report.created_on}', ln=True)

    filename = f'report_{report.hotel_id}.pdf'
    pdf.output(filename)

    return send_file(filename, as_attachment=True)

#service report
@app.route('/report/services', methods=['GET'])
def generate_service_report():
    hotel_id = request.args.get('hotel_id')
    report_type = request.args.get('report_type')  # daily, weekly, monthly, yearly
    start_date, end_date = get_date_range(report_type)
    
    # Fetch data based on date range
    services_data = Service.query.filter(
        Service.hotel_id == hotel_id,
        Service.date >= start_date,
        Service.date <= end_date
    ).all()

    # Generate data
    report_data = []
    total_revenue = 0
    for service in services_data:
        total_revenue += service.revenue
        report_data.append({
            "service_name": service.name,
            "category": service.category,
            "type": service.type,
            "quantity": service.quantity,
            "price": service.price,
            "vat": service.vat,
            "revenue": service.revenue,
            "date": service.date.strftime('%Y-%m-%d')
        })
    
    # Create a PDF or CSV
    file_type = request.args.get('file_type', 'pdf')  # default to PDF
    if file_type == 'csv':
        return generate_csv(report_data)
    elif file_type == 'pdf':
        return generate_pdf(report_data, total_revenue)
    else:
        return jsonify(report_data)

def get_date_range(report_type):
    today = datetime.utcnow()
    if report_type == 'daily':
        return today, today
    elif report_type == 'weekly':
        start_date = today - timedelta(days=today.weekday())  # start of the week
        end_date = start_date + timedelta(days=6)  # end of the week
        return start_date, end_date
    elif report_type == 'monthly':
        start_date = today.replace(day=1)
        end_date = today.replace(day=1) + timedelta(days=32)
        end_date = end_date.replace(day=1) - timedelta(days=1)  # end of the month
        return start_date, end_date
    elif report_type == 'yearly':
        start_date = today.replace(month=1, day=1)
        end_date = today.replace(month=12, day=31)
        return start_date, end_date
    return today, today

def generate_csv(report_data):
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=report_data[0].keys())
    writer.writeheader()
    writer.writerows(report_data)
    output.seek(0)
    return send_file(io.BytesIO(output.getvalue().encode()), attachment_filename="report.csv", as_attachment=True)

def generate_pdf(report_data, total_revenue):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(200, 10, txt="Hotel Services Report", ln=True, align="C")
    pdf.ln(10)

    # Table Header
    pdf.cell(30, 10, "Service Name", border=1)
    pdf.cell(30, 10, "Category", border=1)
    pdf.cell(30, 10, "Type", border=1)
    pdf.cell(30, 10, "Quantity", border=1)
    pdf.cell(30, 10, "Price", border=1)
    pdf.cell(30, 10, "VAT", border=1)
    pdf.cell(30, 10, "Revenue", border=1)
    pdf.ln()

    # Table Data
    for service in report_data:
        pdf.cell(30, 10, service['service_name'], border=1)
        pdf.cell(30, 10, service['category'], border=1)
        pdf.cell(30, 10, service['type'], border=1)
        pdf.cell(30, 10, service['quantity'], border=1)
        pdf.cell(30, 10, str(service['price']), border=1)
        pdf.cell(30, 10, str(service['vat']) + "%", border=1)
        pdf.cell(30, 10, str(service['revenue']), border=1)
        pdf.ln()

    # Total Revenue
    pdf.cell(200, 10, txt=f"Total Revenue: {total_revenue}", ln=True, align="C")
    
    pdf_output = BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)
    return send_file(pdf_output, attachment_filename="services_report.pdf", as_attachment=True)

#services & categories & orders
UPLOAD_FOLDER = 'uploads/'  # Folder where files will be stored
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/services', methods=['POST'])
def create_service():
    # Check if the request contains a file part
     # Validate service name
    if not os.name:
        return jsonify({"error": "Service name is required"}), 400

    # Handle image upload
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            # Secure the filename and prepend the service name
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{secure_filename(os.name)}.{ext}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Ensure the folder exists
            file.save(file_path)
            image_url = f"/{UPLOAD_FOLDER}{filename}"  # URL for accessing the image
        else:
            return jsonify({"error": "Invalid file type"}), 400

        # Save other form data along with the file path to the database
        data = request.form
        new_service = Service(
            name=data.get('name'),
            category=data.get('category'),
            type=data.get('type'),
            department=data.get('department'),
            price=data.get('price'),
            vat=data.get('vat'),
            description=data.get('description'),
            image_path=f'/static/uploads/{filename}'  # Save relative path
        )

        db.session.add(new_service)
        db.session.commit()
        return jsonify(new_service.to_dict()), 201

    return jsonify({"error": "Invalid file type"}), 400
    
@app.route('/categories', methods=['GET', 'POST'])
def manage_categories():
    if request.method == 'POST':
        data = request.json
        category = Category(
            name=data['name'],
            vat=data['vat'],
            delivery_fee=data['delivery_fee'] if 'delivery_fee' in data else None
        )
        db.session.add(category)
        db.session.commit()
        return jsonify({'message': 'Category added successfully!'})
    else:
        categories = Category.query.all()
        return jsonify([{
            'id': category.id,
            'name': category.name,
            'vat': category.vat,
            'delivery_fee': category.delivery_fee
        } for category in categories])

@app.route('/orders', methods=['GET', 'POST'])
def manage_orders():
    if request.method == 'POST':
        data = request.json
        order = Order(
            service_id=data['service_id'],
            guest_name=data.get('guest_name', None),
            amount=data['amount'],
            delivery_status=data['delivery_status'],
            paid_status=data['paid_status'],
            status=data['status']
        )
        db.session.add(order)
        db.session.commit()
        return jsonify({'message': 'Order added successfully!'})
    else:
        orders = Order.query.all()
        return jsonify([{
            'id': order.id,
            'service_id': order.service_id,
            'guest_name': order.guest_name,
            'amount': order.amount,
            'delivery_status': order.delivery_status,
            'paid_status': order.paid_status,
            'status': order.status
        } for order in orders])

#staff
# Create new staff
@app.route('/api/create_staff', methods=['POST'])
def create_staff():
    data = request.get_json()

    # Extract employee data from the incoming request
    new_staff = Staff(
        first_name=data['firstName'],
        middle_name=data.get('middleName', ''),
        last_name=data['lastName'],
        id_card_type=data['idCardType'],
        id_card_number=data['idCardNumber'],
        contact_number=data['contactNumber'],
        email=data['email'],
        residence=data['residence'],
        role=data['role'],
        shift_type=data['shiftType'],
        salary=data['salary'],
        hotel_id=data['hotel_id'],
        next_of_kin_first_name=data['nextOfKin']['firstName'],
        next_of_kin_last_name=data['nextOfKin']['lastName'],
        next_of_kin_relation=data['nextOfKin']['relation'],
        next_of_kin_contact_number=data['nextOfKin']['contactNumber'],
        next_of_kin_email=data['nextOfKin']['email'],
        next_of_kin_residence=data['nextOfKin']['residence']
    )

    try:
        db.session.add(new_staff)
        db.session.commit()
        return jsonify({'message': 'Employee created successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
    #manage staff 

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables in the database
        print("Tables created successfully!")

    socketio.run(app, debug=True, port=5000)