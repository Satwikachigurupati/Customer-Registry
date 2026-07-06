import { useEffect, useState } from "react";
import axios from "axios";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import "./App.css";

function App() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/customers"
    );

    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const deleteCustomer = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/customers/${id}`
    );

    fetchCustomers();
  };

  return (
    <div className="App">
      <h1>Customer Registry System</h1>

      <CustomerForm fetchCustomers={fetchCustomers} />

      <hr />

      <CustomerList
        customers={customers}
        deleteCustomer={deleteCustomer}
      />
    </div>
  );
}

export default App;

