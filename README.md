\# SupportSphere - Customer Care Registry Portal



SupportSphere is a centralized Customer Care Registry system designed as a full-stack MERN application. It records and manages customer interactions, inquiries, feedback, and requests. The system features multi-role authorization, a live communication registry, customizable field definitions, and deep admin analytics dashboards.



\---



\## 🚀 Features \& Roles



\### 1. Customer Portal

\*   \*\*Raise Ticket\*\*: Submit new complaints, requests, feedback, or inquiries.

\*   \*\*Customer Profiles\*\*: Manage contact coordinates and customized profile data.

\*   \*\*Support Chat\*\*: Real-time interactive timeline to communicate with the assigned agent.

\*   \*\*Satisfaction Survey\*\*: Submit feedback ratings (1-5 stars) and comments to automatically resolve and close tickets.



\### 2. Support Agent Console

\*   \*\*Assigned Queues\*\*: Filter and view issues assigned to you.

\*   \*\*Resolution Workflow\*\*: Chat with customers, record internal details, and progress ticket status (`assigned` ➔ `resolved`).



\### 3. Admin Control Center

\*   \*\*KPI Metrics \& SVG Charts\*\*: Live status distributions, average resolution speeds, and customer ratings.

\*   \*\*Assignment Queue\*\*: Select and assign unassigned tickets to agents.

\*   \*\*Custom Fields Creator\*\*: Dynamically create new database schemas and inputs for Customer Profiles and Complaint tickets (e.g. `orderId`, `urgencyLevel`, `companyName`).



\---



\## 🛠️ Tech Stack \& Requirements

\*   \*\*Frontend\*\*: React (Vite, JS), Vanilla CSS (Modern glassmorphism UI variables, HSL color tokens), Lucide Icons, React Router.

\*   \*\*Backend\*\*: Node.js, Express, JWT Security, Cookie-Parser, Mongoose.

\*   \*\*Database\*\*: MongoDB (Local or Atlas).



\---



\## ⚙️ How to Run Locally



\### Step 1: Start MongoDB

Ensure MongoDB is running locally on your laptop:

```bash

\# Default local URI configured in server .env:

mongodb://127.0.0.1:27017/customer-care

```



\### Step 2: Seed the Database

Seed the database with default accounts (admin, agents, customer) and sample tickets:

1\.  Open your VS Code terminal and navigate to the `server/` directory:

&#x20;   ```bash

&#x20;   cd server

&#x20;   ```

2\.  Run the seeding script:

&#x20;   ```bash

&#x20;   npm run seed

&#x20;   ```



\### Step 3: Run the Backend API Server

1\.  In the `server/` directory terminal, start the Express server in development mode:

&#x20;   ```bash

&#x20;   npm run dev

&#x20;   ```

2\.  The backend server will start on: `http://localhost:8000`



\### Step 4: Run the Frontend React App

1\.  Open a new terminal tab/window and navigate to the `client/` directory:

&#x20;   ```bash

&#x20;   cd client

&#x20;   ```

2\.  Start the Vite React development server:

&#x20;   ```bash

&#x20;   npm run dev

&#x20;   ```

3\.  The frontend client will open on: `http://localhost:5173`



\---



\## 🔑 Quick Login Demo Accounts (Pre-seeded)



Use these accounts to instantly test role-specific workflows (or log in directly using the \*\*Quick Login\*\* panel on the sign-in screen):



| Role | Email | Password |

| :--- | :--- | :--- |

| \*\*Administrator\*\* | `admin@customercare.com` | `admin123` |

| \*\*Support Agent 1\*\* | `agent1@customercare.com` | `agent123` |

| \*\*Support Agent 2\*\* | `agent2@customercare.com` | `agent123` |

| \*\*Customer\*\* | `customer@customercare.com` | `customer123` |





<h1 align="center">🚀 Customer Registry Project Demo</h1>



<h3 align="center">

&#x20; <a href="https://drive.google.com/file/d/1cYZQOigqPdQ9-v1ud8axfOSbyNfeFxPj/view?usp=drive\_link">

&#x20;    Click to view Project execution 

&#x20; </a>

</h3>

