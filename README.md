# 📋 Customer Registry System

## 📖 Project Overview

The **Customer Registry System** is a Full Stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed to simplify customer management and customer service operations. It provides an efficient platform for storing, managing, and maintaining customer records in a centralized database.

The application enables users to create, view, and delete customer records while ensuring seamless communication between the frontend and backend. With MongoDB as the database, customer information is securely stored and can be accessed in real time.

---

## 🚀 Features

- 👤 Add new customer records
- 📄 View all registered customers
- ❌ Delete customer records
- 💾 Store customer data in MongoDB
- 🔄 Real-time frontend and backend integration
- ⚡ RESTful API using Express.js
- 📱 Responsive and user-friendly interface
- 🔒 Organized backend architecture using Mongoose

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- HTML5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

---

## 📂 Project Structure

```
Customer-Registry-System/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/customer-registry-system.git
cd customer-registry-system
```

### 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

### 3️⃣ Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4️⃣ Configure Environment Variables

Create a `.env` file inside the **server** folder.

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 5️⃣ Run the Backend

```bash
cd server
npm start
```

### 6️⃣ Run the Frontend

```bash
cd client
npm start
```

The application will run on:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---



