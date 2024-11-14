from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config ['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/hotel_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    room_number = db.Column(db.String(10), nullable=False)
    room_type = db.Column(db.String(20), nullable=False)
    booking_status = db.Column(db.Boolean, default=False)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    room_type = db.Column(db.String(20), nullable=False)
    room_number = db.Column(db.String(10), nullable=False)
    check_in_date = db.Column(db.Date, nullable=False)
    check_out_date = db.Column(db.Date, nullable=False)
    no_of_rooms = db.Column(db.Integer, nullable=False)
    no_of_adults = db.Column(db.Integer, nullable=False)
    no_of_children = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    home_address = db.Column(db.String(200), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default="Reserved")  # e.g., "Reserved", "Checked Out"

db.create_all()

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

if __name__ == '__main__':
    app.run(debug=True)
