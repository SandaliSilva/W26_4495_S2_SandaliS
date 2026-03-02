from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)  # This allows your Node.js backend to talk to this service

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="@Umnotinto23",
        database="safesight_db"
    )

@app.route('/ai/predict-risk', methods=['GET'])
def predict_risk():
    try:
        # 1. Fetch Data from MySQL
        db = get_db_connection()
        query = "SELECT department, shift, incident_type, severity FROM incidents"
        df = pd.read_sql(query, db)
        db.close()

        if df.empty:
            return jsonify({"message": "Not enough data for prediction"}), 200

        # 2. Pre-processing: Convert text (Kitchen, Morning) into numbers
        # Machine Learning models only understand math, not words.
        le_dept = LabelEncoder()
        le_shift = LabelEncoder()
        le_type = LabelEncoder()
        
        df['dept_n'] = le_dept.fit_transform(df['department'])
        df['shift_n'] = le_shift.fit_transform(df['shift'])
        df['type_n'] = le_type.fit_transform(df['incident_type'])
        
        # 3. Training the Random Forest Classifier
        # Features (X): Department and Shift | Target (y): Severity
        X = df[['dept_n', 'shift_n']]
        y = df['severity']
        
        # We use Random Forest because it handles categorical hotel data well
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)

        # 4. Generate Predictions for all departments
        predictions = []
        unique_depts = df['department'].unique()
        
        for dept in unique_depts:
            dept_code = le_dept.transform([dept])[0]
            
            # We predict for a standard "Afternoon" shift (usually encoded as 1 or 2)
            # You can make this dynamic later
            pred_severity = model.predict([[dept_code, 0]])[0]
            
            # Calculate a mock 'Risk Probability' based on incident frequency
            freq = len(df[df['department'] == dept])
            prob = min(int((freq / len(df)) * 100 + 20), 95) 

            predictions.append({
                "department": dept,
                "predicted_severity": pred_severity,
                "risk_probability": f"{prob}%",
                "recommendation": f"Perform a {pred_severity} priority audit in {dept}."
            })

        return jsonify(predictions)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Running on Port 5001 so it doesn't clash with Node.js (5000)
    app.run(port=5001, debug=True)