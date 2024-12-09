"""from flask import Flask, request, jsonify, send_file
from models import db, Hotel, Order
from datetime import datetime, timedelta
import csv
import os
import pandas as pd # type: ignore
from fpdf import FPDF # type: ignore

from models import Report

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/hotel_management'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/api/orders/report', methods=['GET'])
def generate_report():
    hotel_id = request.args.get('hotel_id')
    report_type = request.args.get('report_type', 'daily')
    start_date = request.args.get('start_date', None)
    end_date = request.args.get('end_date', None)

    # Query orders based on hotel ID and date range
    query = Order.query.filter_by(hotel_id=hotel_id)

    if start_date and end_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        query = query.filter(Order.created_on >= start_date, Order.created_on <= end_date)
    
    orders = query.all()

    total_revenue = sum(order.amount for order in orders)
    total_expenses = 0  # You could calculate expenses if you have them stored
    total_profit = total_revenue - total_expenses

    # Save the report in the database
    report = Report(
        hotel_id=hotel_id,
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        total_profit=total_profit,
        report_type=report_type
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({
        'total_revenue': total_revenue,
        'total_expenses': total_expenses,
        'total_profit': total_profit,
        'report_type': report_type,
    })


@app.route('/api/orders/report/export', methods=['GET'])
def export_report():
    hotel_id = request.args.get('hotel_id')
    report_type = request.args.get('report_type')
    report_format = request.args.get('format', 'csv')

    # Fetch the report data from the database
    report = Report.query.filter_by(hotel_id=hotel_id, report_type=report_type).first()

    if not report:
        return jsonify({'error': 'Report not found'}), 404

    # Generate and export the report in the desired format
    if report_format == 'csv':
        return export_to_csv(report)
    elif report_format == 'xlsx':
        return export_to_excel(report)
    elif report_format == 'pdf':
        return export_to_pdf(report)
    else:
        return jsonify({'error': 'Invalid format'}), 400


def export_to_csv(report):
    # Convert data to CSV
    data = [
        ['Hotel ID', 'Total Revenue', 'Total Expenses', 'Total Profit', 'Report Type', 'Created On'],
        [report.hotel_id, report.total_revenue, report.total_expenses, report.total_profit, report.report_type, report.created_on],
    ]
    filename = f'report_{report.hotel_id}.csv'

    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(data)

    return send_file(filename, as_attachment=True)


def export_to_excel(report):
    # Convert data to Excel using Pandas
    data = {
        'Hotel ID': [report.hotel_id],
        'Total Revenue': [report.total_revenue],
        'Total Expenses': [report.total_expenses],
        'Total Profit': [report.total_profit],
        'Report Type': [report.report_type],
        'Created On': [report.created_on],
    }
    df = pd.DataFrame(data)
    filename = f'report_{report.hotel_id}.xlsx'
    df.to_excel(filename, index=False)

    return send_file(filename, as_attachment=True)


def export_to_pdf(report):
    # Create a simple PDF report
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(200, 10, 'Hotel Report', ln=True, align='C')
    pdf.ln(10)

    pdf.set_font('Arial', '', 12)
    pdf.cell(200, 10, f'Hotel ID: {report.hotel_id}', ln=True)
    pdf.cell(200, 10, f'Total Revenue: {report.total_revenue}', ln=True)
    pdf.cell(200, 10, f'Total Expenses: {report.total_expenses}', ln=True)
    pdf.cell(200, 10, f'Total Profit: {report.total_profit}', ln=True)
    pdf.cell(200, 10, f'Report Type: {report.report_type}', ln=True)
    pdf.cell(200, 10, f'Created On: {report.created_on}', ln=True)

    filename = f'report_{report.hotel_id}.pdf'
    pdf.output(filename)

    return send_file(filename, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
"""