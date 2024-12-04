import bcrypt
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_limiter import Limiter
from datetime import timedelta
from werkzeug.security import check_password_hash
import jwt
import datetime
from models import db, Staff


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.secret_key = "your_secret_key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/hotel_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=20)
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # Set True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

db = SQLAlchemy(app) # type: ignore
limiter = Limiter(app, key_func=lambda: request.remote_addr)

SECRET_KEY = "your_jwt_secret"

# Dummy credentials for sample purposes
DUMMY_CREDENTIALS = {
    "admin": "password123",
    "user": "user123"
}

class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

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


if __name__ == '__main__':
    app.run(debug=True)



"""from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_limiter import Limiter
from datetime import timedelta
import jwt
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Restrict CORS in production
app.secret_key = "your_secret_key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/hotel_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=20)
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # Set True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

db = SQLAlchemy(app)
limiter = Limiter(app, key_func=lambda: request.remote_addr)

SECRET_KEY = "your_jwt_secret"

class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

def generate_jwt(hotel_id):
    expiration = datetime.datetime.utcnow() + timedelta(minutes=20)
    token = jwt.encode({'hotel_id': hotel_id, 'exp': expiration}, SECRET_KEY, algorithm='HS256')
    return token

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.json
    hotel = Hotel.query.filter_by(name=data['name']).first()
    if hotel and check_password_hash(hotel.password, data['password']):
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

if __name__ == '__main__':
    app.run(debug=True) """
