"""import os
from flask import Flask, request, jsonify
from models import db, Service, Category, Order
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads/'  # Folder where files will be stored
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    Check if the file has an allowed extension.
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/services', methods=['POST'])
def create_service():
    # Check if the request contains a file part
     # Validate service name
    if not os.name:
        return jsonify({"error": "Service name is required"}), 400

    # Handle image upload
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            # Secure the filename and prepend the service name
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{secure_filename(os.name)}.{ext}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Ensure the folder exists
            file.save(file_path)
            image_url = f"/{UPLOAD_FOLDER}{filename}"  # URL for accessing the image
        else:
            return jsonify({"error": "Invalid file type"}), 400

        # Save other form data along with the file path to the database
        data = request.form
        new_service = Service(
            name=data.get('name'),
            category=data.get('category'),
            type=data.get('type'),
            department=data.get('department'),
            price=data.get('price'),
            vat=data.get('vat'),
            description=data.get('description'),
            image_path=f'/static/uploads/{filename}'  # Save relative path
        )

        db.session.add(new_service)
        db.session.commit()
        return jsonify(new_service.to_dict()), 201

    return jsonify({"error": "Invalid file type"}), 400
    
@app.route('/categories', methods=['GET', 'POST'])
def manage_categories():
    if request.method == 'POST':
        data = request.json
        category = Category(
            name=data['name'],
            vat=data['vat'],
            delivery_fee=data['delivery_fee'] if 'delivery_fee' in data else None
        )
        db.session.add(category)
        db.session.commit()
        return jsonify({'message': 'Category added successfully!'})
    else:
        categories = Category.query.all()
        return jsonify([{
            'id': category.id,
            'name': category.name,
            'vat': category.vat,
            'delivery_fee': category.delivery_fee
        } for category in categories])

@app.route('/orders', methods=['GET', 'POST'])
def manage_orders():
    if request.method == 'POST':
        data = request.json
        order = Order(
            service_id=data['service_id'],
            guest_name=data.get('guest_name', None),
            amount=data['amount'],
            delivery_status=data['delivery_status'],
            paid_status=data['paid_status'],
            status=data['status']
        )
        db.session.add(order)
        db.session.commit()
        return jsonify({'message': 'Order added successfully!'})
    else:
        orders = Order.query.all()
        return jsonify([{
            'id': order.id,
            'service_id': order.service_id,
            'guest_name': order.guest_name,
            'amount': order.amount,
            'delivery_status': order.delivery_status,
            'paid_status': order.paid_status,
            'status': order.status
        } for order in orders])


if __name__ == '__main__':
    app.run(debug=True) """
