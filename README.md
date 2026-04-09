## SafeSight Intelligence: Workplace Safety Forecasting
A Case Study for Fairmont Waterfront Hotel

SafeSight is a full-stack, enterprise-grade safety intelligence platform designed to transition workplace safety from reactive logging to proactive prevention. By combining real-time operational control with machine-learning-driven forecasting, SafeSight empowers managers to identify hazards before they escalate.

## Product Overview
SafeSight provides a "Command Center" for hotel safety, featuring:

Operational Control: Real-time tracking of active incidents with AI-driven prescriptive recommendations.

Strategic Intelligence: Executive dashboards visualizing risk velocity, severity distribution, and departmental risk profiling via Recharts.

Predictive Risk Engine: A Random Forest Classifier that forecasts departmental risk probabilities and assigns strategic preventative actions.

Compliance Automation: One-click generation of WorkSafeBC compatible PDF reports and bulk Excel exports.

## System Architecture
SafeSight has evolved into a microservices-oriented architecture:

Presentation Layer: Developed in React.js, featuring a role-specific UI.

Application Layer (API Gateway): A Node.js/Express server bridging the UI, Database, and AI services.

Intelligence Layer (AI Service): A Python/Flask microservice running a Random Forest Classifier for risk prediction.

Data Layer: MySQL relational database for secure storage of incident records.

🔧 Installation & Setup
1. Prerequisites
Node.js (v16+) & NPM

Python (v3.9+) & Pip

MySQL Server (v8.0+)

2. Database Setup (MySQL)
Create a local database named safesight_db.

Import the schema located in /BackEnd/config/schema.sql.

Configure your credentials in /BackEnd/.env:

Code snippet
DB_HOST=localhost
DB_USER=your_username
DB_PASS=xxxxxxx
DB_NAME=safesight_db

2. Service Orchestration
To run the full-stack environment, start the following three services in separate terminals:

Terminal 1: AI Intelligence Service

Bash
cd AI_Service
python -m venv venv
# Windows: venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python predict.py

Terminal 2: Node.js Backend API

Bash
cd BackEnd
npm install
node server.js
Terminal 3: React Frontend UI

Bash
cd FrontEnd
npm install
npm start

## 🖥️ How to View the Demo
To experience a live demo of the platform using the repository files, follow these steps:

Ensure all tiers are running: The Backend (Port 5000), Frontend (Port 3000), and the Python Virtual Environment must be active.

Access the Dashboard: Open your browser to http://localhost:3000.

Explore the Command Center:

Navigate to Operations to view the live incident log and test the "Resolve" triggers.

Switch to AI Intelligence to see the Recharts visualizations populated by the MySQL dataset.

Visit the Predictive Risk Engine page to see the Random Forest output cards for departments like Housekeeping and Maintenance.

Test the Export: Go to the WorkSafeBC Export section and click "Generate PDF" on any resolved incident to see the automated data-mapping in action.

Interactive Notebooks: For a demo of the data science pipeline, open Misc/safesight_data_preparation.ipynb to view the feature correlation heatmaps and model validation steps.

## Feature Highlights
Predictive Analytics: HR-exclusive "Analytics" tab providing probability scores for potential incidents.

Role-Based Access: Manager-specific views for "Log Incident" and HR-specific views for "Compliance & Analytics."

Data Encoding: Automated preprocessing of categorical data (Shifts/Departments) for ML training.

Interactive Dashboard: Real-time KPI cards for hospitalizations and severity tiers using Recharts.

Reporting and compliance: Export of data and PDF generation

## 🧠 Machine Learning & Research Methodology
The SafeSight engine is powered by a validated Predictive Analytics pipeline. The complete research, including model selection and diagnostic metrics, is documented in the /Misc/SafeSight_Model_Validation.ipynb notebook.

© 2026 SafeSight Intelligence | Final Research Framework | Fairmont Waterfront