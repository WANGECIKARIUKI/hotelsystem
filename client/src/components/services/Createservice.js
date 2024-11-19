import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Createservice.css"; // Import the CSS file

const Createservice = () => {
  const [status, setStatus] = useState(false);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [serviceData, setServiceData] = useState({
    name: "",
    category: "",
    type: "Default",
    department: "",
    inventoryType: "",
    price: "",
    vat: "",
    description: "",
    stockQuantity: "",
    unlimited: true,
    salesPeriodStart: "",  // Start date-time for sales period
    salesPeriodEnd: "",    // End date-time for sales period
    taskName: "",
    taskDescription: "",
    taskTime: "",          // Time of the task
    taskDuration: "",      // Duration of the task
    responsibleDepartment: "",
    responsibleEmployee: "",
  });
  const [image, setImage] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const navigate = useNavigate();

  // Fetch categories, departments, and employees
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchCategories();
    fetchDepartments();
    fetchEmployees();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Toggle unlimited stock
  const handleStockToggle = () => {
    setServiceData((prev) => ({ ...prev, unlimited: !prev.unlimited }));
  };

  // Add task to task list
  const handleAddTask = () => {
    const { taskName, taskDescription, taskTime, taskDuration, responsibleDepartment, responsibleEmployee } = serviceData;
    const newTask = {
      taskName,
      taskDescription,
      taskTime,
      taskDuration,
      responsibleDepartment,
      responsibleEmployee,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setServiceData((prev) => ({
      ...prev,
      taskName: "",
      taskDescription: "",
      taskTime: "",
      taskDuration: "",
      responsibleDepartment: "",
      responsibleEmployee: "",
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceData.name) {
      alert("Service name is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", serviceData.name);
    formData.append("category", serviceData.category);
    formData.append("type", serviceData.type);
    formData.append("department", serviceData.department);
    formData.append("inventoryType", serviceData.inventoryType);
    formData.append("price", serviceData.price);
    formData.append("vat", serviceData.vat);
    formData.append("description", serviceData.description);
    formData.append("stockQuantity", serviceData.unlimited ? "unlimited" : serviceData.stockQuantity);
    formData.append("status", status);
    formData.append("salesPeriodStart", serviceData.salesPeriodStart);
    formData.append("salesPeriodEnd", serviceData.salesPeriodEnd);
    tasks.forEach((task, index) => {
      formData.append(`taskName[${index}]`, task.taskName);
      formData.append(`taskDescription[${index}]`, task.taskDescription);
      formData.append(`taskTime[${index}]`, task.taskTime);
      formData.append(`taskDuration[${index}]`, task.taskDuration);
      formData.append(`responsibleDepartment[${index}]`, task.responsibleDepartment);
      formData.append(`responsibleEmployee[${index}]`, task.responsibleEmployee);
    });
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("/services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/services");
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  return (
    <div className="create-service-container">
      <h1>Create Service</h1>
      <form onSubmit={handleSubmit} className="form">
        {/* Status Section */}
        <div className="form-group">
          <label>Status: </label>
          <input
            type="checkbox"
            checked={status}
            onChange={() => setStatus(!status)}
          />
        </div>

        {/* Image Upload Section */}
        <div className="form-group">
          <h3>Upload Image</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* General Information Section */}
        <div className="form-group">
          <h3>General Information</h3>
          <input
            name="name"
            placeholder="Service Name"
            value={serviceData.name}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={serviceData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            name="type"
            value={serviceData.type}
            onChange={handleChange}
          >
            <option value="Default">Default</option>
            <option value="Voucher">Voucher</option>
          </select>
          <select
            name="department"
            value={serviceData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock & Availability Section */}
        <div className="form-group">
          <h3>Stock & Availability</h3>
          <label>Unlimited Stock: </label>
          <input
            type="checkbox"
            checked={serviceData.unlimited}
            onChange={handleStockToggle}
          />
          {!serviceData.unlimited && (
            <input
              name="stockQuantity"
              type="number"
              value={serviceData.stockQuantity}
              onChange={handleChange}
              placeholder="Enter Stock Quantity"
            />
          )}
        </div>

        {/* Description Section */}
        <div className="form-group">
          <h3>Description</h3>
          <textarea
            name="description"
            value={serviceData.description}
            onChange={handleChange}
            placeholder="Service Description"
          />
        </div>

        {/* Pricing Section */}
        <div className="form-group">
          <h3>Pricing</h3>
          <input
            name="price"
            type="number"
            value={serviceData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
          <input
            name="vat"
            type="number"
            value={serviceData.vat}
            onChange={handleChange}
            placeholder="VAT (%)"
          />
        </div>

        {/* Sales Period Section */}
        <div className="form-group">
          <h3>Sales Period</h3>
          <label>Start Date and Time:</label>
          <input
            name="salesPeriodStart"
            type="datetime-local"
            value={serviceData.salesPeriodStart}
            onChange={handleChange}
          />
          <label>End Date and Time:</label>
          <input
            name="salesPeriodEnd"
            type="datetime-local"
            value={serviceData.salesPeriodEnd}
            onChange={handleChange}
          />
        </div>

        {/* Task Templates Section */}
        <div className="form-group">
          <h3>Task Templates</h3>
          <input
            name="taskName"
            type="text"
            value={serviceData.taskName}
            onChange={handleChange}
            placeholder="Task Name"
          />
          <textarea
            name="taskDescription"
            value={serviceData.taskDescription}
            onChange={handleChange}
            placeholder="Task Description"
          />
          <label>Task Time:</label>
          <input
            name="taskTime"
            type="time"
            value={serviceData.taskTime}
            onChange={handleChange}
          />
          <label>Task Duration:</label>
          <input
            name="taskDuration"
            type="number"
            value={serviceData.taskDuration}
            onChange={handleChange}
            placeholder="Duration (in minutes)"
          />
          <select
            name="responsibleDepartment"
            value={serviceData.responsibleDepartment}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
          <select
            name="responsibleEmployee"
            value={serviceData.responsibleEmployee}
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Section */}
        <div className="form-actions">
          <button type="submit" className="btn save-btn">Save</button>
          <button
            type="button"
            className="btn cancel-btn"
            onClick={() => navigate("/services")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Createservice;
