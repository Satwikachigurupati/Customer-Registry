import { useState } from "react";
import axios from "axios";

function CustomerForm({ fetchCustomers }) {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    issueCategory: "",
    issueDescription: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/customers",
      formData
    );

    setFormData({
      customerName: "",
      phone: "",
      email: "",
      issueCategory: "",
      issueDescription: ""
    });

    fetchCustomers();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="customerName"
        placeholder="Customer Name"
        value={formData.customerName}
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        name="issueCategory"
        placeholder="Issue Category"
        value={formData.issueCategory}
        onChange={handleChange}
        required
      />

      <textarea
        name="issueDescription"
        placeholder="Issue Description"
        value={formData.issueDescription}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Add Customer
      </button>
    </form>
  );
}

export default CustomerForm;
