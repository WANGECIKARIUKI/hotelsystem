"""from flask import Blueprint, request, jsonify
from models import db, Room
from flask_jwt_extended import jwt_required, get_jwt_identity

housekeeping_bp = Blueprint('housekeeping', __name__)

@housekeeping_bp.route('/housekeeping/rooms', methods=['GET'])
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

@housekeeping_bp.route('/housekeeping/rooms', methods=['POST'])
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

@housekeeping_bp.route('/housekeeping/rooms/<int:id>', methods=['PUT'])
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
    return jsonify({'message': 'Room not found'}), 404 """
