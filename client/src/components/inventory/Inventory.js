import React, { useState, useEffect } from "react";
import { fetchInventory, addItem, updateItem, deleteItem } from "./api";
import "./Inventory.css";

function Inventory() {
  const [hotelId, setHotelId] = useState(1); // Example hotel ID
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page
  const [form, setForm] = useState({ item_name: "", quantity: "", description: "" });

  const dummyData = [
    { id: 1, hotel_id: 1, item_name: "Towels", quantity: 50, description: "White cotton towels" },
    { id: 2, hotel_id: 1, item_name: "Shampoo Bottles", quantity: 100, description: "Small shampoo bottles" },
    { id: 3, hotel_id: 1, item_name: "Soap Bars", quantity: 200, description: "Moisturizing soap bars" },
    { id: 1, hotel_id: 1, item_name: "Towels", quantity: 50, description: "White cotton towels" },
    { id: 2, hotel_id: 1, item_name: "Shampoo Bottles", quantity: 100, description: "Small shampoo bottles" },
    { id: 3, hotel_id: 1, item_name: "Soap Bars", quantity: 200, description: "Moisturizing soap bars" },
    { id: 4, hotel_id: 1, item_name: "Plates", quantity: 30, description: "Ceramic dinner plates" },
    { id: 5, hotel_id: 1, item_name: "Forks", quantity: 50, description: "Stainless steel forks" },
    { id: 6, hotel_id: 1, item_name: "Chef Knives", quantity: 10, description: "Professional chef knives" },
    { id: 7, hotel_id: 1, item_name: "Light Bulbs", quantity: 100, description: "Energy-efficient LED bulbs" },
    { id: 8, hotel_id: 1, item_name: "Cleaning Supplies", quantity: 20, description: "Multi-purpose cleaners" },
    { id: 9, hotel_id: 1, item_name: "Tool Kits", quantity: 5, description: "Basic maintenance toolkits" },
    { id: 10, hotel_id: 1, item_name: "Notebooks", quantity: 15, description: "Reception logbooks" },
    { id: 11, hotel_id: 1, item_name: "Pens", quantity: 50, description: "Blue ink pens for guest forms" },
    { id: 12, hotel_id: 1, item_name: "Room Key Cards", quantity: 200, description: "Magnetic room key cards" },
    { id: 1, hotel_id: 1, item_name: "Towels", quantity: 50, description: "White cotton towels" },
    { id: 2, hotel_id: 1, item_name: "Shampoo Bottles", quantity: 100, description: "Small shampoo bottles" },
    { id: 3, hotel_id: 1, item_name: "Soap Bars", quantity: 200, description: "Moisturizing soap bars" },
    { id: 4, hotel_id: 1, item_name: "Plates", quantity: 30, description: "Ceramic dinner plates" },
    { id: 5, hotel_id: 1, item_name: "Forks", quantity: 50, description: "Stainless steel forks" },
    { id: 6, hotel_id: 1, item_name: "Chef Knives", quantity: 10, description: "Professional chef knives" },
    { id: 7, hotel_id: 1, item_name: "Light Bulbs", quantity: 100, description: "Energy-efficient LED bulbs" },
    { id: 8, hotel_id: 1, item_name: "Cleaning Supplies", quantity: 20, description: "Multi-purpose cleaners" },
    { id: 9, hotel_id: 1, item_name: "Tool Kits", quantity: 5, description: "Basic maintenance toolkits" },
    { id: 10, hotel_id: 1, item_name: "Notebooks", quantity: 15, description: "Reception logbooks" },
    { id: 11, hotel_id: 1, item_name: "Pens", quantity: 50, description: "Blue ink pens for guest forms" },
    { id: 12, hotel_id: 1, item_name: "Room Key Cards", quantity: 200, description: "Magnetic room key cards" },
  ];

  const loadInventory = async () => {
    try {
      const response = await fetchInventory(hotelId);
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory(dummyData); // Use dummy data in case of an error
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addItem({ ...form, hotel_id: hotelId });
      setForm({ item_name: "", quantity: "", description: "" });
      loadInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({ item_name: item.item_name, quantity: item.quantity, description: item.description });
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      loadInventory();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdate = async (id) => {
    const updatedQuantity = prompt("Enter new quantity:");
    if (updatedQuantity) {
      try {
        await updateItem(id, { quantity: updatedQuantity });
        const updatedInventory = inventory.map((item) =>
          item.id === id ? { ...item, quantity: updatedQuantity } : item
        );
        setInventory(updatedInventory);
      } catch (error) {
        console.error("Error updating item:", error);
      }
    }
  };

  // Filter and pagination logic
  const filteredItems = inventory.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="inventory-container">
      <div className="inventory">
        <h1>Hotel Inventory Management</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item Name"
            value={form.item_name}
            onChange={(e) => setForm({ ...form, item_name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          ></textarea>
          <button type="submit">Add Item</button>
        </form>

        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
          style={{ width: "20%", justifyContent: "center" }}
        />

        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.description}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button onClick={() => handleUpdate(item.id)}>
                    <i className="fa fa-refresh" aria-hidden="true"></i>
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
