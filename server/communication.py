from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, Hotel, Message, CommunicationChannel, Reservation

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:password@localhost/hotel_management'
db.init_app(app)

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

if __name__ == '__main__':
    app.run(debug=True)
