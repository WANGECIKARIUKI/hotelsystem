import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

export const fetchInventory = (hotelId) =>
  axios.get(`${API_BASE_URL}/inventory/${hotelId}`);

export const addItem = (item) =>
  axios.post(`${API_BASE_URL}/inventory`, item);

export const updateItem = (id, updatedItem) =>
  axios.put(`${API_BASE_URL}/inventory/${id}`, updatedItem);

export const deleteItem = (id) =>
  axios.delete(`${API_BASE_URL}/inventory/${id}`);
