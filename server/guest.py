# routes.py
from flask import Flask, request, jsonify
from models import db, Guest, Service, Payment
import uuid

app = Flask(__name__)

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
