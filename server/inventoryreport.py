"""from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pandas as pd # type: ignore
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/hotel_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

# Import models
from models import Hotel, Inventory

@app.route('/api/inventory/<int:hotel_id>/report', methods=['GET'])
def generate_inventory_report(hotel_id):
    # Fetch inventory data for the hotel
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Inventory.query.filter(Inventory.hotel_id == hotel_id)
    if start_date:
        query = query.filter(Inventory.last_updated >= start_date)
    if end_date:
        query = query.filter(Inventory.last_updated <= end_date)
    
    inventory_data = query.all()
    report = [
        {
            "item_name": item.item_name,
            "quantity": item.quantity,
            "description": item.description,
            "last_updated": item.last_updated.strftime('%Y-%m-%d'),
        }
        for item in inventory_data
    ]
    return jsonify(report)

@app.route('/api/inventory/<int:hotel_id>/export/<format>', methods=['GET'])
def export_inventory_report(hotel_id, format):
    query = Inventory.query.filter(Inventory.hotel_id == hotel_id)
    inventory_data = query.all()

    data = [
        {"Item Name": item.item_name, "Quantity": item.quantity, "Description": item.description,
         "Last Updated": item.last_updated.strftime('%Y-%m-%d')}
        for item in inventory_data
    ]
    df = pd.DataFrame(data)
    filename = f"inventory_report_{hotel_id}_{datetime.now().strftime('%Y%m%d')}.{format}"

    if format == "csv":
        df.to_csv(filename, index=False)
    elif format == "xlsx":
        df.to_excel(filename, index=False)
    elif format == "pdf":
        df.to_csv('temp.csv', index=False)  # Generate CSV and then convert to PDF.
        os.system(f"csv2pdf temp.csv {filename}")
        os.remove('temp.csv')

    return send_file(filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)  """
