## SafeSight Intelligence: Workplace Safety Forecasting
A Case Study for Fairmont Waterfront Hotel

SafeSight is a professional 3-tier safety management system designed to transition workplace safety from reactive reporting to proactive forecasting. It integrates Machine Learning (Random Forest) to predict departmental risks and features a secure Role-Based Access Control (RBAC) system.

## System Architecture
SafeSight has evolved into a microservices-oriented architecture:

Presentation Layer: Developed in React.js, featuring a role-specific UI.

Application Layer (API Gateway): A Node.js/Express server bridging the UI, Database, and AI services.

Intelligence Layer (AI Service): A Python/Flask microservice running a Random Forest Classifier for risk prediction.

Data Layer: MySQL relational database for secure storage of incident records.

## Phase 2 & 3 Progress (Completed)
AI Integration: Successfully deployed a Python Flask service for real-time risk forecasting.

Predictive Modeling: Implemented a Random Forest algorithm to analyze 391+ historical records.

RBAC Security: Established secure routing in React to differentiate between HR Personnel and Department Managers.

Service Bridging: Implemented an Axios-based API gateway in Node.js to connect JS and Python environments.

🔧 Installation & Setup
1. Prerequisites
Node.js (v16+) & NPM

Python (v3.9+) & Pip

MySQL Server (v8.0+)

2. Service Orchestration
To run the full-stack environment, start the following three services in separate terminals:

Terminal 1: AI Intelligence Service

Bash
cd AI_Service
python -m venv venv
# Windows: venv\Scripts\activate
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

## Feature Highlights
Predictive Analytics: HR-exclusive "Analytics" tab providing probability scores for potential incidents.

Role-Based Access: Manager-specific views for "Log Incident" and HR-specific views for "Compliance & Analytics."

Data Encoding: Automated preprocessing of categorical data (Shifts/Departments) for ML training.

Interactive Dashboard: Real-time KPI cards for hospitalizations and severity tiers using Recharts.

## 🧠 Machine Learning & Research Methodology
The SafeSight engine is powered by a validated Predictive Analytics pipeline. The complete research, including model selection and diagnostic metrics, is documented in the /Misc/SafeSight_Model_Validation.ipynb notebook.

## Final Project Roadmap
[ ] Phase 4 (Final): Implementation of WorkSafeBC Form 7 automated document generation.

[ ] Feedback Implementation: Integration of an AI Safety Chatbot for real-time protocol guidance.

[ ] System Hardening: Final security audit and data validation.

© 2026 SafeSight Intelligence | Final Research Framework | Fairmont Waterfront