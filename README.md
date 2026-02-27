# W26_4495_S2_SandaliS

# SafeSight Work Safety Dashboard

A full-stack Work Safety Monitoring and Predictive Analytics system developed as a case study for Fairmont Waterfront Hotel. It tracks workplace safety incidents, visualizes key metrics through an interactive dashboard, and predicts department-level safety risk using historical data.

## Phase 1 Progress
- Repository structure established.
- Backend environment initialized with Node.js and Express.
- Initial data preparation started in `/Misc/safesight_data_preparation.ipynb`.
- Database schema designed for incident tracking.

## Installation & Setup
Follow these instructions to configure the local development environment and run the full-stack demo.

1. Prerequisites
Node.js (v16.0 or higher)

MySQL Server (v8.0 or higher)

NPM (Node Package Manager)

2. Database Configuration
The system relies on a relational MySQL schema to process complex safety metrics.

Open MySQL Workbench and connect to your local instance.

Create the project database:

SQL
CREATE DATABASE safesight_db;
Import the provided SQL dump file (located in the /database folder) to populate the 391 records, including severity tiers and hospitalization data.

Ensure your incidents table structure matches the defined schema.

3. Backend Implementation (Node.js)
The backend acts as a RESTful API bridge between the MySQL database and the React UI.

Navigate to the backend directory:

Bash
cd BackEnd
Install required dependencies (Express, MySQL, CORS):

Bash
npm install
Configure your database credentials in server.js.

Start the server:

Bash
node server.js
Success Indicator: Terminal should display: 🚀 Server started on port 5000.

4. Frontend Implementation (React.js)
The frontend uses Recharts to visualize data-driven safety insights.

Open a new terminal window and navigate to the frontend directory:

Bash
cd FrontEnd
Install dependencies:

Bash
npm install
Launch the application:

Bash
npm start
Access: The dashboard will be available at http://localhost:3000.

Data Verification: Confirm the Total Incidents (391) and Critical Risks (380) metrics are correctly populated from the backend.

Feature Highlights
Executive Dashboard: Real-time KPI cards for hospitalizations (345 cases) and high-risk probabilities.
Departmental Risk Profile: Data-driven bar charts identifying Housekeeping and Food & Beverage as the highest-risk sectors.
Severity Distribution: Categorization of 391 incidents into Critical, High, Medium, and Low tiers.
Incident Velocity Trend: Time-series analysis tracking safety trends across a 12-month period.

Tech Stack
Frontend: React.js, Recharts, CSS3
Backend: Node.js, Express
Database: MySQL
Design Framework: AIDA (Attention, Interest, Desire, Action)

📅 Project Roadmap
Phase 1 (Completed): Full-stack integration and historical data visualization.
Phase 2 (Ongoing): Implementation of WorkSafeBC Form 7 automated document generation.
Phase 3 (Upcoming): AI-driven predictive modeling for proactive hazard detection.