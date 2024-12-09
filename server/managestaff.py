"""from flask import Blueprint, Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from server.models import NextOfKin, Staff

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/db_name'  # Update with your credentials
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#new staff blueprint
staff_routes = Blueprint('staff', __name__)

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

#new staff
@staff_routes.route('/create_staff', methods=['POST'])
def create_employee():
    data = request.json
    try:
        employee = Staff(
            hotel_id=data['hotel_id'],
            first_name=data['first_name'],
            middle_name=data.get('middle_name', ''),
            last_name=data['last_name'],
            id_card_type=data['id_card_type'],
            id_card_number=data['id_card_number'],
            contact_number=data['contact_number'],
            email=data['email'],
            residence=data['residence'],
            role=data['role'],
            shift_type=data['shift_type'],
            salary=data['salary']
        )
        db.session.add(employee)
        db.session.commit()

        next_of_kin = NextOfKin(
            employee_id=employee.id,
            first_name=data['next_of_kin']['first_name'],
            last_name=data['next_of_kin']['last_name'],
            relation=data['next_of_kin']['relation'],
            contact_number=data['next_of_kin']['contact_number'],
            email=data['next_of_kin']['email'],
            residence=data['next_of_kin']['residence']
        )
        db.session.add(next_of_kin)
        db.session.commit()
        return jsonify({"message": "Employee created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@staff_routes.route('/staff/<int:hotel_id>', methods=['GET'])
def get_employees(hotel_id):
    staff = Staff.query.filter_by(hotel_id=hotel_id).all()
    return jsonify([employee.to_dict() for employee in staff])

if __name__ == '__main__':
    app.run(debug=True) """
