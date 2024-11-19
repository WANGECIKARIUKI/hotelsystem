import React, { useState } from "react";
import axios from "axios";

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
    <div className="hotel-communication-container">
  <div className="communication-content">
    <h1>Hotel Communication System</h1>

    {/* Error Message */}
    {errorMessage && (
      <div className="error-container">
        <div className="error-message">{errorMessage}</div>
      </div>
    )}

    {/* Search Bar */}
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search emails, guests, or employees"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((result) => (
            <li key={result.id} onClick={() => handleSelectResult(result)}>
              {result.name || result.email}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Communication Options */}
    <div className="channel-buttons">
      <button onClick={() => setChannel("email")}>Email</button>
      <button onClick={() => setChannel("inchat")}>In-Chat</button>
      <button onClick={() => setChannel("push")}>Push Notification</button>
    </div>

    {/* Channel-Specific Content */}
    {channel === "email" && (
      <div className="email-section">
        <input
          type="text"
          placeholder="Subject"
          value={messageData.subject}
          onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
        />
        <textarea
          placeholder="Message"
          value={messageData.message}
          onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
        />
      </div>
    )}

    {channel === "inchat" && (
      <div className="chat-section">
        <textarea
          placeholder="Chat Message"
          value={messageData.message}
          onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
        />
      </div>
    )}

    {channel === "push" && (
      <div className="push-section">
        <input
          type="text"
          placeholder="Client Name"
          value={messageData.subject}
          onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
        />
        <textarea
          placeholder="Push Message"
          value={messageData.message}
          onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
        />
      </div>
    )}

    <button onClick={handleSendMessage}>Send Message</button>
  </div>
</div>
  );
}

export default Communication;
