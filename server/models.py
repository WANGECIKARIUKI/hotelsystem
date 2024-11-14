from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Dashboard Models
class HotelRevenue(db.Model):
    __tablename__ = 'hotel_revenue'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    rooms_revenue = db.Column(db.Float, default=0.0, nullable=False)
    food_beverages_revenue = db.Column(db.Float, default=0.0, nullable=False)
    telephone_revenue = db.Column(db.Float, default=0.0, nullable=False)
    other_revenue = db.Column(db.Float, default=0.0, nullable=False)

    def serialize(self):
        return {
            'date': self.date.isoformat(),
            'rooms_revenue': self.rooms_revenue,
            'food_beverages_revenue': self.food_beverages_revenue,
            'telephone_revenue': self.telephone_revenue,
            'other_revenue': self.other_revenue,
        }


class BookingSource(db.Model):
    __tablename__ = 'booking_source'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    online_channel = db.Column(db.Float, default=0.0, nullable=False)
    offline_channel = db.Column(db.Float, default=0.0, nullable=False)
    repeat_clients = db.Column(db.Float, default=0.0, nullable=False)
    website_channel = db.Column(db.Float, default=0.0, nullable=False)
    referrals = db.Column(db.Float, default=0.0, nullable=False)

    def serialize(self):
        return {
            'online_channel': self.online_channel,
            'offline_channel': self.offline_channel,
            'repeat_clients': self.repeat_clients,
            'website_channel': self.website_channel,
            'referrals': self.referrals,
        }


class OccupancyRate(db.Model):
    __tablename__ = 'occupancy_rate'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    occupancy_rate = db.Column(db.Float)

    def serialize(self):
        return {
            'date': self.date.isoformat(),
            'occupancy_rate': self.occupancy_rate,
        }

# Hotel Management Models
class Hotel(db.Model):
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    total_rooms = db.Column(db.Integer, nullable=False)
    revenue_generated = db.Column(db.Float, nullable=False, default=0.0)
    reservations = db.relationship('Reservation', backref='hotel', lazy=True)
    staff = db.relationship('Staff', backref='hotel', lazy=True)

    def __repr__(self):
        return f'<Hotel {self.name}>'


class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    room_type = db.Column(db.String(50), nullable=False)
    room_number = db.Column(db.String(10), nullable=False, unique=True)
    price = db.Column(db.Float, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    reservations = db.relationship('Reservation', backref='room', lazy=True)

    def __repr__(self):
        return f'<Room {self.room_number} of {self.hotel_id}>'


class Reservation(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    check_in_date = db.Column(db.DateTime, nullable=False)
    check_out_date = db.Column(db.DateTime, nullable=False)
    no_of_rooms = db.Column(db.Integer, nullable=False)
    no_of_children = db.Column(db.Integer, nullable=True)
    no_of_adults = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    home_address = db.Column(db.String(200), nullable=False)
    telephone = db.Column(db.String(15), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Reservation {self.id} for {self.first_name} {self.last_name}>'


class Staff(db.Model):
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    shift = db.Column(db.String(50), nullable=False)
    joining_date = db.Column(db.DateTime, default=datetime.utcnow)
    salary = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Staff {self.name}>'

# Notifications and Complaints
class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    message = db.Column(db.String(250), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Notification {self.id}>'

class Complaint(db.Model):
    __tablename__ = 'complaints'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    complainant_name = db.Column(db.String(255), nullable=False)
    complaint_type = db.Column(db.String(255), nullable=False)
    complaint_description = db.Column(db.Text, nullable=False)
    created_on = db.Column(db.DateTime, default=datetime.utcnow)
    resolved = db.Column(db.Boolean, default=False)
    resolved_on = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Complaint {self.id} by {self.complainant_name}>'

# Employee and Next of Kin Management
class Staff(db.Model):
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    middle_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=False)
    id_card_type = db.Column(db.String(20), nullable=False)
    id_card_number = db.Column(db.String(50), unique=True, nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    residence = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    shift_type = db.Column(db.String(50), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Staff {self.first_name} {self.last_name}>'

class NextOfKin(db.Model):
    __tablename__ = 'next_of_kin'
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    relation = db.Column(db.String(20), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    residence = db.Column(db.String(100), nullable=False)
    employee = db.relationship('Staff', backref='next_of_kin')

    def __repr__(self):
        return f'<Next of Kin {self.first_name} {self.last_name}>'

#guest management
class Guest(db.Model):
    __tablename__ = 'guests'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    nationality = db.Column(db.String(50), nullable=True)
    language = db.Column(db.String(20), nullable=True)
    guest_id = db.Column(db.String(20), unique=True, nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    phone_number = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(50), nullable=True)
    region = db.Column(db.String(50), nullable=True)
    city = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(100), nullable=True)
    zip_code = db.Column(db.String(20), nullable=True)
    id_card_type = db.Column(db.String(50), nullable=True)
    id_card_number = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    bookings = db.relationship('Booking', backref='guest', lazy=True)
    payments = db.relationship('Payment', backref='guest', lazy=True)

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id'), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

class Payment(db.Model):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id'), nullable=False)
    amount_due = db.Column(db.Float, nullable=False)
    amount_paid = db.Column(db.Float, default=0.0)
    pending_amount = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.now)