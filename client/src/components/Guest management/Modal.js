function Modal({ show, onClose, guest }) {
    if (!show) return null;

    console.log('Rendering Modal with guest:', guest); // Check if the modal is being rendered

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Guest Details</h2>
                <p><strong>Full Name:</strong> {guest.first_name} {guest.last_name}</p>
                <p><strong>Email:</strong> {guest.email}</p>
                <p><strong>Date of Birth:</strong> {new Date(guest.date_of_birth).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {guest.address}</p>
                <p><strong>Nationality:</strong> {guest.nationality}</p>
                <h3>Services</h3>
                {guest.services && guest.services.map((service, index) => (
                    <p key={index}>{service}</p>
                ))}
                <h3>Charges</h3>
                <p><strong>Total Charges:</strong> ${guest.total_charges}</p>
                <p><strong>Amount Paid:</strong> ${guest.amount_paid}</p>
                <p><strong>Pending Balance:</strong> ${guest.pending_balance}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default Modal;
