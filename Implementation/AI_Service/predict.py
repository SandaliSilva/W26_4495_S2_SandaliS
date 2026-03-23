import pandas as pd
from sqlalchemy import create_engine
from flask import Flask, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

app = Flask(__name__)
CORS(app)

engine = create_engine('mysql+mysqlconnector://root:@Umnotinto23@localhost/safesight_db')

@app.route('/ai/predict-risk', methods=['GET'])
def predict_future():
    try:
        # 1. Fetch Data
        query = "SELECT department, shift, incident_type, severity FROM incidents"
        df = pd.read_sql(query, engine)

        # 2. Safety Check: If data is too thin, return meaningful "Mock" insights for the UI
        if df is None or len(df) < 3 or df['severity'].nunique() < 2:
            return jsonify([
                {
                    "department": "Kitchen (Simulated)",
                    "risk_probability": "High",
                    "confidence": "82.5%",
                    "recommendation": "Future Forecast: Historical patterns suggest increased slip risks during evening shifts."
                },
                {
                    "department": "Housekeeping (Simulated)",
                    "risk_probability": "Stable",
                    "confidence": "15.0%",
                    "recommendation": "Future Forecast: Low risk detected. Maintain current ergonomic training."
                }
            ])

        # 3. Encoding text to numbers
        le_dept = LabelEncoder()
        le_shift = LabelEncoder()
        
        df['dept_n'] = le_dept.fit_transform(df['department'])
        df['shift_n'] = le_shift.fit_transform(df['shift'])
        
        # Target: Is it 'Critical' or 'High'? (Binary classification)
        y = df['severity'].apply(lambda x: 1 if x in ['Critical', 'High'] else 0)
        X = df[['dept_n', 'shift_n']]

        # 4. TRAINING
        model = RandomForestClassifier(n_estimators=100)
        model.fit(X, y)

        # 5. GENERATE FUTURE PREDICTIONS
        results = []
        for dept in df['department'].unique():
            dept_code = le_dept.transform([dept])[0]
            
            # Predict probability of a high-risk event (index 1 is 'True')
            # We assume a 'Night' shift (usually higher risk) for the simulation
            prob = model.predict_proba([[dept_code, 0]])[0][1] 
            
            score = prob * 100
            forecast = "High" if score > 50 else "Elevated" if score > 20 else "Stable"
            
            results.append({
                "department": dept,
                "risk_probability": forecast,
                "confidence": f"{round(score, 1)}%",
                "recommendation": f"Future Forecast: {forecast} risk level for {dept}. {get_advice(dept)}"
            })

        return jsonify(results)

    except Exception as e:
        print(f"❌ AI Error: {e}")
        return jsonify([{"department": "AI Engine", "recommendation": f"Error: {str(e)}", "risk_probability": "Error"}]), 500

def get_advice(dept):
    advices = {
        "Kitchen": "Audit wet-floor signage.",
        "Housekeeping": "Check chemical storage labels.",
        "Maintenance": "Inspect ladder safety kits.",
        "Security": "Review patrol communication logs."
    }
    return advices.get(dept, "Continue standard safety monitoring.")

if __name__ == "__main__":
    app.run(port=5001, debug=True)

# from flask import Flask, jsonify
# from flask_cors import CORS
# import mysql.connector
# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.preprocessing import LabelEncoder

# app = Flask(__name__)
# CORS(app)

# def get_db_connection():
#     return mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="@Umnotinto23",
#         database="safesight_db"
#     )

# # --- NEW: Prescriptive Mapping Engine ---
# def get_prescriptive_action(dept, severity):
#     """Generates specific Fairmont-relevant advice based on Dept and Predicted Risk"""
#     actions = {
#         "Kitchen": {
#             "Critical": "Immediate installation of non-slip floor matting and mandatory knife-safety retraining.",
#             "High": "Review chemical storage protocols and PPE compliance for stewarding staff.",
#             "Medium": "Schedule deep cleaning of grease traps to prevent fire hazards.",
#             "Low": "Conduct 5-minute toolbox talk on ergonomic lifting."
#         },
#         "Housekeeping": {
#             "Critical": "Urgent audit of heavy lifting equipment and room attendant trolley weight limits.",
#             "High": "Mandatory musculoskeletal injury prevention workshop for floor staff.",
#             "Medium": "Inspect vacuum cords for fraying and electrical safety.",
#             "Low": "Update signage for wet floor protocols during public area cleaning."
#         },
#         "Front Office": {
#             "High": "Implement de-escalation training for front-desk staff regarding difficult guest interactions.",
#             "Low": "Ergonomic assessment of workstation chair heights."
#         }
#     }
    
#     # Get dept-specific advice, or provide a smart default
#     dept_actions = actions.get(dept, {})
#     return dept_actions.get(severity, f"Increase supervisor oversight in {dept} during peak hours.")

# @app.route('/ai/predict-risk', methods=['GET'])
# def predict_risk():
#     try:
#         db = get_db_connection()
#         # Added ROOT_CAUSE to the query for future NLP analysis
#         query = "SELECT department, shift, incident_type, severity, root_cause FROM incidents"
#         df = pd.read_sql(query, db)
#         db.close()

#         if df.empty:
#             return jsonify({"message": "Not enough data for prediction"}), 200

#         # Pre-processing
#         le_dept = LabelEncoder()
#         le_shift = LabelEncoder()
        
#         df['dept_n'] = le_dept.fit_transform(df['department'])
#         df['shift_n'] = le_shift.fit_transform(df['shift'])
        
#         X = df[['dept_n', 'shift_n']]
#         y = df['severity']
        
#         model = RandomForestClassifier(n_estimators=100, random_state=42)
#         model.fit(X, y)

#         predictions = []
#         unique_depts = df['department'].unique()
        
#         for dept in unique_depts:
#             dept_code = le_dept.transform([dept])[0]
            
#             # Predict for the most frequent shift in that department to be accurate
#             mode_shift = df[df['department'] == dept]['shift_n'].mode()[0]
#             pred_severity = model.predict([[dept_code, mode_shift]])[0]
            
#             # Mock Probability logic based on department frequency
#             freq = len(df[df['department'] == dept])
#             prob = min(int((freq / len(df)) * 100 + 25), 98) 

#             # GENERATE THE SPECIFIC ACTION
#             prescriptive_action = get_prescriptive_action(dept, pred_severity)

#             predictions.append({
#                 "department": dept,
#                 "predicted_severity": pred_severity,
#                 "risk_probability": f"{prob}%",
#                 "recommendation": prescriptive_action # Now dynamic!
#             })

#         return jsonify(predictions)

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5001, debug=True)