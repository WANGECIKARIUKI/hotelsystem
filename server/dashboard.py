"""from flask import Flask, jsonify
from flask_socketio import SocketIO # type: ignore
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

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

if __name__ == '__main__':
    socketio.run(app, debug=True) """
