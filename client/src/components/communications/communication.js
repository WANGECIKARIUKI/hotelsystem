import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaComments, FaBell } from "react-icons/fa"; // Import icons

function Communication() {
  const [channel, setChannel] = useState("email");
  const [messageData, setMessageData] = useState({
    hotel_id: 1,
    sender_type: "employee",
    sender_id: 1,
    recipient_id: "",
    subject: "",
    message: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  // Fetch search results
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search?q=${searchQuery}`);
      setSearchResults(response.data); // Assume response is a list of search results
      setErrorMessage(""); // Clear previous error messages
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("An error occurred while fetching search results.");
    }
  };

  const handleSelectResult = (result) => {
    setMessageData({ ...messageData, recipient_id: result.id });
    setSearchQuery(""); // Clear the search bar after selection
    setSearchResults([]); // Clear search results
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send_message", messageData);
      console.log(response.data);
      setErrorMessage(""); // Clear error message if sending succeeds
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send the message. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>Hotel Communication System</h1>

        {/* Error Message */}
        {errorMessage && (
          <div style={styles.errorContainer}>
            <div style={styles.errorMessage}>{errorMessage}</div>
          </div>
        )}

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search emails, guests, or employees"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>
          {searchResults.length > 0 && (
            <ul style={styles.searchResults}>
              {searchResults.map((result) => (
                <li key={result.id} onClick={() => handleSelectResult(result)} style={styles.searchResultItem}>
                  {result.name || result.email}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Channel Buttons with Icons */}
        <div style={styles.channelButtons}>
          <button onClick={() => setChannel("email")} style={{...styles.channelButton, backgroundColor: "#007BFF"}}>
            <FaEnvelope size={20} style={styles.icon} /> Email
          </button>
          <button onClick={() => setChannel("inchat")} style={{...styles.channelButton, backgroundColor: "#28a745"}}>
            <FaComments size={20} style={styles.icon} /> In-Chat
          </button>
          <button onClick={() => setChannel("push")} style={{...styles.channelButton, backgroundColor: "#FFC107"}}>
            <FaBell size={20} style={styles.icon} /> Push Notification
          </button>
        </div>

        {/* Channel-Specific Content */}
        <div style={styles.channelContent}>
          {channel === "email" && (
            <div style={styles.emailSection}>
              <h2>Email Communication</h2>
              <input
                type="text"
                placeholder="Subject"
                value={messageData.subject}
                onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                style={styles.input}
              />
              <textarea
                placeholder="Message"
                value={messageData.message}
                onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                style={styles.textarea}
              />
            </div>
          )}

          {channel === "inchat" && (
            <div style={styles.chatSection}>
              <h2>In-Chat Communication</h2>
              <textarea
                placeholder="Chat Message"
                value={messageData.message}
                onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                style={styles.textarea}
              />
            </div>
          )}

          {channel === "push" && (
            <div style={styles.pushSection}>
              <h2>Push Notification</h2>
              <input
                type="text"
                placeholder="Client Name"
                value={messageData.subject}
                onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                style={styles.input}
              />
              <textarea
                placeholder="Push Message"
                value={messageData.message}
                onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                style={styles.textarea}
              />
            </div>
          )}
        </div>

        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send Message
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
  },
  errorMessage: {
    color: "#721c24",
    fontSize: "14px",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "300px",
    padding: "8px 12px",
    marginRight: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  searchButton: {
    padding: "8px 12px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  searchResults: {
    listStyle: "none",
    marginTop: "10px",
    padding: "0",
  },
  searchResultItem: {
    padding: "8px",
    backgroundColor: "#f1f1f1",
    marginBottom: "5px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  channelButtons: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  channelButton: {
    padding: "10px 15px",
    marginRight: "10px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: "8px",
  },
  channelContent: {
    marginBottom: "20px",
  },
  emailSection: {
    marginBottom: "20px",
  },
  chatSection: {
    marginBottom: "20px",
  },
  pushSection: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  sendButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Communication;
