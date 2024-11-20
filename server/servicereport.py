from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
import csv
import io
import pandas as pd # type: ignore
from io import BytesIO
from fpdf import FPDF # type: ignore
from models import db, Service, Expense, Report, Hotel
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/hotel_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/report/services', methods=['GET'])
def generate_report():
    hotel_id = request.args.get('hotel_id')
    report_type = request.args.get('report_type')  # daily, weekly, monthly, yearly
    start_date, end_date = get_date_range(report_type)
    
    # Fetch data based on date range
    services_data = Service.query.filter(
        Service.hotel_id == hotel_id,
        Service.date >= start_date,
        Service.date <= end_date
    ).all()

    # Generate data
    report_data = []
    total_revenue = 0
    for service in services_data:
        total_revenue += service.revenue
        report_data.append({
            "service_name": service.name,
            "category": service.category,
            "type": service.type,
            "quantity": service.quantity,
            "price": service.price,
            "vat": service.vat,
            "revenue": service.revenue,
            "date": service.date.strftime('%Y-%m-%d')
        })
    
    # Create a PDF or CSV
    file_type = request.args.get('file_type', 'pdf')  # default to PDF
    if file_type == 'csv':
        return generate_csv(report_data)
    elif file_type == 'pdf':
        return generate_pdf(report_data, total_revenue)
    else:
        return jsonify(report_data)

def get_date_range(report_type):
    today = datetime.utcnow()
    if report_type == 'daily':
        return today, today
    elif report_type == 'weekly':
        start_date = today - timedelta(days=today.weekday())  # start of the week
        end_date = start_date + timedelta(days=6)  # end of the week
        return start_date, end_date
    elif report_type == 'monthly':
        start_date = today.replace(day=1)
        end_date = today.replace(day=1) + timedelta(days=32)
        end_date = end_date.replace(day=1) - timedelta(days=1)  # end of the month
        return start_date, end_date
    elif report_type == 'yearly':
        start_date = today.replace(month=1, day=1)
        end_date = today.replace(month=12, day=31)
        return start_date, end_date
    return today, today

def generate_csv(report_data):
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=report_data[0].keys())
    writer.writeheader()
    writer.writerows(report_data)
    output.seek(0)
    return send_file(io.BytesIO(output.getvalue().encode()), attachment_filename="report.csv", as_attachment=True)

def generate_pdf(report_data, total_revenue):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(200, 10, txt="Hotel Services Report", ln=True, align="C")
    pdf.ln(10)

    # Table Header
    pdf.cell(30, 10, "Service Name", border=1)
    pdf.cell(30, 10, "Category", border=1)
    pdf.cell(30, 10, "Type", border=1)
    pdf.cell(30, 10, "Quantity", border=1)
    pdf.cell(30, 10, "Price", border=1)
    pdf.cell(30, 10, "VAT", border=1)
    pdf.cell(30, 10, "Revenue", border=1)
    pdf.ln()

    # Table Data
    for service in report_data:
        pdf.cell(30, 10, service['service_name'], border=1)
        pdf.cell(30, 10, service['category'], border=1)
        pdf.cell(30, 10, service['type'], border=1)
        pdf.cell(30, 10, service['quantity'], border=1)
        pdf.cell(30, 10, str(service['price']), border=1)
        pdf.cell(30, 10, str(service['vat']) + "%", border=1)
        pdf.cell(30, 10, str(service['revenue']), border=1)
        pdf.ln()

    # Total Revenue
    pdf.cell(200, 10, txt=f"Total Revenue: {total_revenue}", ln=True, align="C")
    
    pdf_output = BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)
    return send_file(pdf_output, attachment_filename="services_report.pdf", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
