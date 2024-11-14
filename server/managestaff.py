from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/db_name'  # Update with your credentials
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Staff Model
class Staff(db.Model):
    __tablename__ = 'staff'

    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    address = db.Column(db.Text)
    role = db.Column(db.String(100))
    shift = db.Column(db.String(50))
    joining_date = db.Column(db.Date)
    next_of_kin_name = db.Column(db.String(255))
    next_of_kin_phone = db.Column(db.String(15))
    salary = db.Column(db.Numeric(10, 2))

    def __repr__(self):
        return f"<Staff {self.name}>"

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
    app.run(debug=True)
