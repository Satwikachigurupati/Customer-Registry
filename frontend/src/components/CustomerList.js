import React from "react";

function CustomerList({ customers, deleteCustomer }) {
  return (
    <div>
      <h2>Customer Records</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Category</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.customerName}</td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
              <td>{customer.issueCategory}</td>
              <td>{customer.issueDescription}</td>
              <td>{customer.status}</td>

              <td>
                <button
                  onClick={() => deleteCustomer(customer._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
