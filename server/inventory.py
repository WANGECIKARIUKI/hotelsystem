"""from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector # type: ignore

app = Flask(__name__)
CORS(app)

# MySQL Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="your_user",
    password="your_password",
    database="hotel_management"
)

# Create models table if not exists
cursor = db.cursor()
cursor.execute('''
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    description TEXT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);
''')
db.commit()

@app.route('/inventory/<int:hotel_id>', methods=['GET'])
def get_inventory(hotel_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM inventory WHERE hotel_id = %s", (hotel_id,))
    inventory = cursor.fetchall()
    return jsonify(inventory)

@app.route('/inventory', methods=['POST'])
def add_item():
    data = request.json
    hotel_id = data.get('hotel_id')
    item_name = data.get('item_name')
    quantity = data.get('quantity')
    description = data.get('description', '')

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO inventory (hotel_id, item_name, quantity, description) VALUES (%s, %s, %s, %s)",
        (hotel_id, item_name, quantity, description)
    )
    db.commit()
    return jsonify({'message': 'Item added successfully!'}), 201

@app.route('/inventory/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM inventory WHERE id = %s", (item_id,))
    db.commit()
    return jsonify({'message': 'Item deleted successfully!'})

@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    item_name = data.get('item_name')
    quantity = data.get('quantity')
    description = data.get('description', '')

    cursor = db.cursor()
    cursor.execute(
        "UPDATE inventory SET item_name = %s, quantity = %s, description = %s WHERE id = %s",
        (item_name, quantity, description, item_id)
    )
    db.commit()
    return jsonify({'message': 'Item updated successfully!'})

if __name__ == '__main__':
    app.run(debug=True) """
