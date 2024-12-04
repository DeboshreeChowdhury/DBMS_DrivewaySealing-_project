## Driveway Sealing Database Management System
Project Overview:
**The Driveway Sealing Management System is a web-based platform designed to manage driveway sealing operations efficiently. It allows clients to request driveway sealing quotes and manage their orders and bills, while the admin (David Smith) handles requests, quotes, and billing from an operational standpoint. The platform ensures smooth interaction between the client and the admin with functionality to manage negotiations and track progress.

---

## 🚀 Features

### 🌟 Client Features
- **Registration:** Clients can register with their details, including address, phone number, and payment information.
- **Quote Submission:** Clients submit driveway-sealing requests, including:
  - Property address.
  - Driveway size (square feet).
  - Proposed price.
  - Uploading up to 5 images of the driveway.
  - Adding additional notes.
- **Quote Management:**
  - View all quotes with status (`pending`, `agreed`, `rejected`).
  - Accept, negotiate, or close quotes.
- **Order Management:**
  - Track orders created from accepted quotes.
  - View details such as work start and end dates and agreed price.
- **Bill Management:**
  - View bills generated after work completion.
  - Pay bills or dispute them with reasons.

### 🛡️ Admin Features
- **Quote Management:**
  - View all incoming quotes from clients.
  - Accept, reject, or propose counter-offers with updated terms.
- **Order Management:**
  - Track orders and view details such as property address, schedule, and price.
- **Bill Management:**
  - Generate bills for completed work.
  - Resolve disputes by providing notes or discounts.
- **Reporting:**
  - Generate detailed reports for:
    - Top clients.
    - Difficult clients.
    - Overdue bills.
    - Payment behaviors and more.

### 📊 Reports
- Analyze key metrics with reports such as:
  - Clients with the most completed orders.
  - Overdue bills.
  - Good and bad client payment behavior.

---

## 🛠️ Technology Stack

### Backend
- **Node.js**: Server-side runtime for scalable web applications.
- **Express.js**: Framework for building RESTful APIs.
- **MySQL**: Relational database for data storage and querying.
- **dotenv**: Manage environment variables securely.

### Frontend
- **HTML5 & CSS3**: Structure and styling.
- **JavaScript**: Dynamic content updates and API integration.
- **Responsive Design**: Optimized for various screen sizes.

### Tools
- **XAMPP**: Local database server for MySQL.
- **Postman**: Testing RESTful API endpoints.
- **Git/GitHub**: Version control and collaboration.

---

##Team Members
-**Deboshree Chowdhury 
-**Syed Ali

### 💻 How to Run the Project
-**git clone https://github.com/your-username/driveway-sealing-management.git
-**cd driveway-sealing-management
-**cd src/backend
-**npm install
-**node server.js
--**Open the src/frontend/index.html file in a browser to view the landing page.


### Project Workflow
-**Client Dashboard:

-**Register as a client.
-**Submit a driveway sealing request.
-**View and manage submitted quotes, orders, and bills.
-**Admin Dashboard:

-**Review client quotes.
-**Approve, reject, or negotiate terms.
-**Generate orders and bills.
-**Handle disputes and generate reports.
-**Negotiation Loop:
-**Both clients and admin can negotiate quotes and bills until an agreement is reached or the request is closed.





