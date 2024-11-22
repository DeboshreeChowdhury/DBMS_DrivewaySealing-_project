Driveway Sealing Database Management System
Project Overview
This project is a web-based database management system for a driveway-sealing contractor, David Smith. It facilitates client registration, driveway-sealing quote requests, order management, and billing workflows, including negotiation loops for both quotes and bills. The system features separate dashboards for David Smith and clients, offering an intuitive interface to manage operations seamlessly.

Features
Client Dashboard:
Register as a new client.
Submit driveway-sealing quote requests, including driveway details and images.
View and respond to quotes, orders, and bills.
Dispute or pay bills directly through the dashboard.
David Smith Dashboard:
Review and respond to incoming quote requests.
Manage orders and schedule driveway-sealing services.
Handle billing workflows, including disputes and adjustments.
Generate revenue and client activity reports for specific periods.
Reporting:
Identify:
Big clients (highest number of completed orders).
Difficult clients (multiple quote submissions with no follow-up).
Overdue bills and bad clients.
Quotes agreed upon this month.
Largest driveway worked on.
Technologies
Frontend: HTML, CSS, JavaScript
Backend: Node.js (Express.js)
Database: MySQL
Version Control: Git and GitHub
Testing Tools: Postman, MySQL Workbench
Project Structure
bash
Copy code
/db
   - schema.sql        # Database schema
   - queries.sql       # SQL queries for reporting
   - mock-data.sql     # Sample data for testing
/src
   /backend
      - db_config.js   # Database connection setup
      - model.js       # Database queries and operations
      - routes.js      # API endpoints
      - server.js      # Express server setup
   /frontend
      - index.html          # Landing page
      - admin_dashboard.html # Admin dashboard
      - client_dashboard.html # Client dashboard
      - style.css           # Shared styles
      - scripts.js          # Dynamic JavaScript functionality
/docs
   - er-diagram.png    # E-R diagram
   - user-manual.pdf   # User guide (optional for honors students)
   - developer-manual.pdf # Developer documentation (optional for honors students)
Team Members
Deboshree Chowdhury (hg9512)
Syed Ali