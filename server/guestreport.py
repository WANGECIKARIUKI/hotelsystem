"""from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import pandas as pd # type: ignore
from fpdf import FPDF # type: ignore
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/hotel_management'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import Guest, Revenue

@app.route('/generate_report', methods=['POST'])
def generate_report():
    try:
        data = request.get_json()
        hotel_id = data.get("hotel_id")
        report_type = data.get("report_type")  # e.g., daily, weekly, monthly, yearly
        export_format = data.get("export_format")  # e.g., 'pdf', 'csv', 'excel'

        # Fetch data for the report
        guests = Guest.query.filter_by(hotel_id=hotel_id).all()
        revenue = Revenue.query.filter_by(hotel_id=hotel_id).all()

        guest_data = [{
            "Guest Name": f"{guest.first_name} {guest.last_name}",
            "Date of Booking": guest.created_at.strftime("%Y-%m-%d"),
            "Charges": guest.total_charges,
            "Amount Paid": guest.amount_paid,
            "Pending Balance": guest.pending_balance
        } for guest in guests]

        revenue_data = [{
            "Date": rev.date.strftime("%Y-%m-%d"),
            "Revenue": rev.amount
        } for rev in revenue]

        # Combine data into a DataFrame for processing
        df_guests = pd.DataFrame(guest_data)
        df_revenue = pd.DataFrame(revenue_data)

        # Export based on user format
        if export_format == 'csv':
            df_guests.to_csv('guests_report.csv', index=False)
            return send_file('guests_report.csv', as_attachment=True)
        elif export_format == 'excel':
            writer = pd.ExcelWriter('report.xlsx', engine='xlsxwriter')
            df_guests.to_excel(writer, sheet_name='Guests', index=False)
            df_revenue.to_excel(writer, sheet_name='Revenue', index=False)
            writer.save()
            return send_file('report.xlsx', as_attachment=True)
        elif export_format == 'pdf':
            
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            pdf.cell(200, 10, txt="Guest Report", ln=True, align='C')
            for _, row in df_guests.iterrows():
                pdf.cell(200, 10, txt=str(row.to_dict()), ln=True)
            pdf.output("report.pdf")
            return send_file('report.pdf', as_attachment=True)

        return jsonify({"message": "Invalid format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
"""