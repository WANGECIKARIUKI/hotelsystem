"""from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'  # Database to store staff info
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)
db = SQLAlchemy(app)

# Staff model
class Staff(db.Model):

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

# Create the database (run once to initialize the database)
@app.before_first_request
def create_tables():
    db.create_all()

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

# Initialize the database
with app.app_context():
    db.create_all()

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

if __name__ == '__main__':
    app.run(debug=True) """
