import React, { useState, useEffect } from 'react';
import './complaints.css';

function Managecomplaints() {
    const [complaint, setComplaint] = useState({
        complainant_name: '',
        complaint_type: '',
        complaint_description: '',
    });
    const [complaints, setComplaints] = useState([]);
    const [hotelId] = useState(1); // Replace with actual hotel ID from authentication
    const [resolvedId, setResolvedId] = useState(null);
    const [budget, setBudget] = useState(0);

    const fetchComplaints = async () => {
        try {
            const response = await fetch(`/api/complaints/${hotelId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            if (Array.isArray(data) && data.length === 0) {
                // Use dummy data if no complaints are retrieved from the server
                const dummyData = [
                    {
                        id: 1,
                        complainant_name: 'John Doe',
                        complaint_type: 'Noise Complaint',
                        complaint_description: 'Loud music from the neighboring room.',
                        created_on: new Date().toISOString(),
                        resolved: false,
                        budget: null,
                    },
                    {
                        id: 2,
                        complainant_name: 'Jane Smith',
                        complaint_type: 'Room Cleanliness',
                        complaint_description: 'The room was not cleaned properly.',
                        created_on: new Date().toISOString(),
                        resolved: false,
                        budget: null,
                    },
                    {
                        id: 3,
                        complainant_name: 'Alice Johnson',
                        complaint_type: 'Air Conditioning',
                        complaint_description: 'Air conditioning is not working.',
                        created_on: new Date().toISOString(),
                        resolved: true,
                        resolved_on: new Date().toISOString(),
                        budget: 50,
                    },
                    {
                        id: 4,
                        complainant_name: 'Robert Brown',
                        complaint_type: 'Water Leakage',
                        complaint_description: 'Water leakage in the bathroom.',
                        created_on: new Date().toISOString(),
                        resolved: true,
                        resolved_on: new Date().toISOString(),
                        budget: 100,
                    },
                ];
                setComplaints(dummyData);
            } else {
                setComplaints(data);
            }
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
            // Set dummy data if there’s a network error or parsing issue
            setComplaints([
                {
                    id: 1,
                    complainant_name: 'John Doe',
                    complaint_type: 'Noise Complaint',
                    complaint_description: 'Loud music from the neighboring room.',
                    created_on: new Date().toISOString(),
                    resolved: false,
                    budget: null,
                },
                {
                    id: 2,
                    complainant_name: 'Jane Smith',
                    complaint_type: 'Room Cleanliness',
                    complaint_description: 'The room was not cleaned properly.',
                    created_on: new Date().toISOString(),
                    resolved: false,
                    budget: null,
                },
                {
                    id: 3,
                    complainant_name: 'Alice Johnson',
                    complaint_type: 'Air Conditioning',
                    complaint_description: 'Air conditioning is not working.',
                    created_on: new Date().toISOString(),
                    resolved: true,
                    resolved_on: new Date().toISOString(),
                    budget: 50,
                },
                {
                    id: 4,
                    complainant_name: 'Robert Brown',
                    complaint_type: 'Water Leakage',
                    complaint_description: 'Water leakage in the bathroom.',
                    created_on: new Date().toISOString(),
                    resolved: true,
                    resolved_on: new Date().toISOString(),
                    budget: 100,
                },
            ]);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComplaint({ ...complaint, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/complaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...complaint, hotel_id: hotelId }),
        });
        fetchComplaints();
        setComplaint({ complainant_name: '', complaint_type: '', complaint_description: '' });
    };

    const handleResolve = async (id) => {
        try {
            const response = await fetch(`/api/complaints/resolve/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ budget, resolved: true }), // Sending resolved status
            });

            if (response.ok) {
                await fetchComplaints();  // Refresh complaints list
                setResolvedId(null);       // Close the popup
                setBudget(0);              // Reset the budget input
            } else {
                console.error("Failed to resolve complaint: ", response.statusText);
                alert("Failed to resolve the complaint.");
            }
        } catch (error) {
            console.error("Error resolving complaint: ", error);
            alert("An error occurred while resolving the complaint.");
        }
    };

    return (
        <div className="complaints">
            <h1>Manage Complaints</h1>

            <form onSubmit={handleSubmit} className="complaint-form">
                <div className="form-section">
                    <div className="input-group">
                        <input
                            type="text"
                            name="complainant_name"
                            placeholder="Complainant Name"
                            value={complaint.complainant_name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                        <input
                            type="text"
                            name="complaint_type"
                            placeholder="Complaint Type"
                            value={complaint.complaint_type}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <textarea
                        name="complaint_description"
                        placeholder="Describe Complaint"
                        value={complaint.complaint_description}
                        onChange={handleChange}
                        required
                        className="description-box"
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit">Submit</button>
                    <button type="reset" onClick={() => setComplaint({ complainant_name: '', complaint_type: '', complaint_description: '' })}>
                        Reset
                    </button>
                </div>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>Complainant Name</th>
                        <th>Complaint Type</th>
                        <th>Complaint Description</th>
                        <th>Created On</th>
                        <th>Resolve</th>
                        <th>Budget</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.length > 0 ? (
                        complaints.map((c, index) => (
                            <tr key={c.id}>
                                <td>{index + 1}</td>
                                <td>{c.complainant_name}</td>
                                <td>{c.complaint_type}</td>
                                <td>{c.complaint_description}</td>
                                <td>{new Date(c.created_on).toLocaleString()}</td>
                                <td>
                                    {c.resolved ? (
                                        `Resolved on ${new Date(c.resolved_on).toLocaleString()}`
                                    ) : (
                                        <button onClick={() => setResolvedId(c.id)}>Resolve</button>
                                    )}
                                </td>
                                <td>{c.budget !== null ? `$${c.budget.toFixed(2)}` : '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No complaints found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {resolvedId && (
                <div className="popup">
                    <h2>Resolve Complaint</h2>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="input-field"
                    />
                    <button onClick={() => handleResolve(resolvedId)}>Resolve Complaint</button>
                    <button onClick={() => setResolvedId(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Managecomplaints;
