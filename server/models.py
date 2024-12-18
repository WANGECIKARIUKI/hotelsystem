from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import relationship

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
    __table_args__ = {'extend_existing': True} # extension since there are multipe hotel classes
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
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    room_type = db.Column(db.String(50), nullable=False)
    room_number = db.Column(db.String(10), nullable=False, unique=True)
    price = db.Column(db.Float, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    booking_status = db.Column(db.Boolean, default=False)
    reservations = db.relationship('Reservation', backref='room', lazy=True)

    def __repr__(self):
        return f'<Room {self.room_number} of {self.hotel_id}>'

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
    def __repr__(self):
        return f'<Reservation {self.id} for {self.first_name} {self.last_name}>'


class Staff(db.Model):
    __table_args__ = {'extend_existing': True}
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
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'staff'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    middle_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=False)
    id_card_type = db.Column(db.String(50), nullable=False)
    id_card_number = db.Column(db.String(100), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    residence = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    shift_type = db.Column(db.String(50), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    hotel_id = db.Column(db.Integer, nullable=False)  # Hotel ID for multi-tenancy
    next_of_kin_first_name = db.Column(db.String(100), nullable=False)
    next_of_kin_last_name = db.Column(db.String(100), nullable=False)
    next_of_kin_relation = db.Column(db.String(50), nullable=False)
    next_of_kin_contact_number = db.Column(db.String(20), nullable=False)
    next_of_kin_email = db.Column(db.String(100), nullable=False)
    next_of_kin_residence = db.Column(db.String(100), nullable=False)

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
    employee = db.relationship('Staff', backref='next_of_kin', lazy = True)

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

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    check_in_date = db.Column(db.Date, nullable=False)
    check_out_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False)

    guest = db.relationship('Guest', backref='bookings', lazy=True)
    room = db.relationship('Room', backref='bookings', lazy=True)


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

#housekeeping
class Hotel(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

class Room(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    room_number = db.Column(db.String(10), nullable=False)
    room_type = db.Column(db.Enum('Single', 'Double', 'Suite', 'Family'), nullable=False)
    housekeeping_status = db.Column(db.Enum('clean', 'cleaning_in_progress', 'dirty', 'out_of_service'), nullable=False)
    priority = db.Column(db.Enum('high', 'low'), default='low')
    reservation_status = db.Column(db.Enum('due_in', 'checked_in', 'due_out'))
    comments = db.Column(db.Text)

    hotel = db.relationship('Hotel', backref='rooms')


#order services and category
class Hotel(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    services = relationship('Service', backref='hotel')
    categories = relationship('Category', backref='hotel')
    orders = relationship('Order', backref='hotel')


class Service(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    department = db.Column(db.String(50))
    quantity = db.Column(db.Integer, default=-1)
    vat_percentage = db.Column(db.Float, default=0.0)
    price = db.Column(db.Float)
    is_active = db.Column(db.Boolean, default=False)
    image_path = db.Column(db.String(255), nullable=True)  # Path to the uploaded image


class Category(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    vat_percentage = db.Column(db.Float, default=0.0)
    has_delivery = db.Column(db.Boolean, default=False)
    delivery_fee = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "vat_percentage": self.vat_percentage,
            "has_delivery": self.has_delivery,
            "delivery_fee": self.delivery_fee
        }


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))
    status = db.Column(db.String(50))
    guest_name = db.Column(db.String(100), nullable=True)
    delivery_details = db.Column(db.String(100))
    amount = db.Column(db.Float)
    vat = db.Column(db.Float)
    total = db.Column(db.Float)

    def to_dict(self):
        return {
            "id": self.id,
            "service_id": self.service_id,
            "status": self.status,
            "guest_name": self.guest_name,
            "delivery_details": self.delivery_details,
            "amount": self.amount,
            "vat": self.vat,
            "total": self.total
        }
    
#communication
class Hotel(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'hotels'  # Correct table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))

class CommunicationChannel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))  # Corrected foreign key reference
    type = db.Column(db.Enum('email', 'inchat', 'push'))


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey('communication_channel.id'))
    sender_type = db.Column(db.Enum('employee', 'guest'))
    sender_id = db.Column(db.Integer)
    recipient_id = db.Column(db.Integer)
    subject = db.Column(db.String(255))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            "sender_type": self.sender_type,
            "sender_id": self.sender_id,
            "recipient_id": self.recipient_id,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.created_at
        }

# accounting
class Invoice(db.Model):
    __tablename__ = 'invoices'
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id'), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    invoice_date = db.Column(db.Date, nullable=False)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.Enum('expectant', 'paid'), nullable=False)
    net_amount = db.Column(db.Numeric(10, 2), nullable=False)
    gross_amount = db.Column(db.Numeric(10, 2), nullable=False)

class InvoiceItem(db.Model):
    __tablename__ = 'invoice_items'
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'), nullable=False)
    service_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    net_amount = db.Column(db.Numeric(10, 2), nullable=False)
    vat_percentage = db.Column(db.Numeric(5, 2), nullable=False)
    discount = db.Column(db.Numeric(10, 2), nullable=True)     

#inventory reports
class Hotel(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    item_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(255))
    last_updated = db.Column(db.DateTime, nullable=False)

    hotel = db.relationship('Hotel', backref=db.backref('inventories', lazy=True))   

#orders report
class Hotel(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    orders = db.relationship('Order', backref='hotel', lazy=True)
    
class Report(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    total_revenue = db.Column(db.Float, nullable=False)
    total_expenses = db.Column(db.Float, nullable=False)
    total_profit = db.Column(db.Float, nullable=False)
    report_type = db.Column(db.String(50))  # e.g., daily, weekly, monthly, annual
    created_on = db.Column(db.DateTime, default=datetime.utcnow)       

#services report
class Hotel(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'hotels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    services = db.relationship('Service', backref='hotel', lazy=True)
    expenses = db.relationship('Expense', backref='hotel', lazy=True)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    category = db.Column(db.String(100))
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Report(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    report_type = db.Column(db.String(50))  # daily, weekly, monthly, yearly
    data = db.Column(db.JSON)  # Store aggregated data in JSON format
    created_at = db.Column(db.DateTime, default=datetime.utcnow)    


#gueest reports
class Revenue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)

#login 

class Staff(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'admin' or 'employee'
    hotel_id = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'hotel_id': self.hotel_id
        }


"""from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import relationship

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
    rooms = db.relationship('Room', backref='hotel', lazy=True)
    services = db.relationship('Service', backref='hotel', lazy=True)
    categories = db.relationship('Category', backref='hotel', lazy=True)
    orders = db.relationship('Order', backref='hotel', lazy=True)

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
    booking_status = db.Column(db.Boolean, default=False)
    reservations = db.relationship('Reservation', backref='room', lazy=True)

    def __repr__(self):
        return f'<Room {self.room_number} of {self.hotel_id}>'

class Reservation(db.Model):
    __tablename__ = 'reservations'
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

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    department = db.Column(db.String(50))
    quantity = db.Column(db.Integer, default=-1)
    vat_percentage = db.Column(db.Float, default=0.0)
    price = db.Column(db.Float)
    is_active = db.Column(db.Boolean, default=False)
    image_path = db.Column(db.String(255), nullable=True)

    category = db.relationship('Category', backref='services')

    def __repr__(self):
        return f'<Service {self.name}>'

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    vat_percentage = db.Column(db.Float, default=0.0)
    has_delivery = db.Column(db.Boolean, default=False)
    delivery_fee = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "vat_percentage": self.vat_percentage,
            "has_delivery": self.has_delivery,
            "delivery_fee": self.delivery_fee
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'))
    status = db.Column(db.String(50))
    guest_name = db.Column(db.String(100), nullable=True)
    delivery_details = db.Column(db.String(100))
    amount = db.Column(db.Float)
    vat = db.Column(db.Float)
    total = db.Column(db.Float)

    def to_dict(self):
        return {
            "id": self.id,
            "service_id": self.service_id,
            "status": self.status,
            "guest_name": self.guest_name,
            "delivery_details": self.delivery_details,
            "amount": self.amount,
            "vat": self.vat,
            "total": self.total
        }

# Communication and Notifications
class CommunicationChannel(db.Model):
    __tablename__ = 'communication_channels'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))
    type = db.Column(db.Enum('email', 'inchat', 'push'))

    hotel = db.relationship('Hotel', backref='communication_channels')

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey('communication_channels.id'))
    sender_type = db.Column(db.Enum('employee', 'guest'))
    sender_id = db.Column(db.Integer)
    recipient_id = db.Column(db.Integer)
    subject = db.Column(db.String(255))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            "sender_type": self.sender_type,
            "sender_id": self.sender_id,
            "recipient_id": self.recipient_id,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.created_at
        }

# Invoice and Accounting
class Invoice(db.Model):
    __tablename__ = 'invoices'
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('guests.id'), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    invoice_date = db.Column(db.Date, nullable=False)
    invoice_number = db.Column(db.String(100), nullable=False, unique=True)
    amount = db.Column(db.Float, nullable=False)
    paid = db.Column(db.Boolean, default=False)

class InvoiceItem(db.Model):
    __tablename__ = 'invoice_items'
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'))
    description = db.Column(db.String(255))
    amount = db.Column(db.Float)

# Guest Information
class Guest(db.Model):
    __tablename__ = 'guests'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    reservations = db.relationship('Reservation', backref='guest', lazy=True)

# Housekeeping and Maintenance Models
class Housekeeping(db.Model):
    __tablename__ = 'housekeeping'
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))
    assigned_staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'))
    task_type = db.Column(db.String(100), nullable=False)
    task_status = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(50))
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    room = db.relationship('Room', backref='housekeeping')
    staff = db.relationship('Staff', backref='housekeeping')

# Inventory
class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))

    hotel = db.relationship('Hotel', backref='inventory')

#reports
class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=False)
    date_generated = db.Column(db.DateTime, default=datetime.utcnow)
    content = db.Column(db.Text, nullable=False)

    hotel = db.relationship('Hotel', backref='reports')

    def __repr__(self):
        return f'<Report {self.id} for Hotel {self.hotel_id}>'"""




