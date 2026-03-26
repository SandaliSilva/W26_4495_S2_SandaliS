import mysql.connector
from datetime import datetime, timedelta
import random

# Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Umnotinto23",
    database="safesight_db"
)
cursor = db.cursor()

departments = ["Kitchen", "Housekeeping", "Maintenance", "Front Office", "Security"]
incident_types = ["Slip/Fall", "Lifting Strain", "Chemical Exposure", "Equipment Failure", "Sharp Object"]
severities = ["Low", "Medium", "High", "Critical"]
shifts = ["Morning", "Afternoon", "Night"]

print("🚀 Starting data injection for SafeSight AI Training...")

for i in range(50):
    # Create dates spread over the last 180 days
    random_days_ago = random.randint(0, 180)
    dt = datetime.now() - timedelta(days=random_days_ago)
    formatted_date = dt.strftime('%Y-%m-%d %H:%M:%S')
    
    dept = random.choice(departments)
    # Logic: Make Kitchen have more Slips on weekends (Time-Series Pattern)
    if dept == "Kitchen" and dt.weekday() >= 4:
        inc_type = "Slip/Fall"
        sev = "High"
    else:
        inc_type = random.choice(incident_types)
        sev = random.choice(severities)

    sql = """INSERT INTO incidents 
             (department, work_area, shift, incident_datetime, incident_type, description, severity, status) 
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    
    values = (
        dept, 
        f"{dept} Section {random.randint(1,4)}", 
        random.choice(shifts), 
        formatted_date, 
        inc_type, 
        "Generated for AI research pattern analysis.", 
        sev, 
        "Resolved"
    )
    
    cursor.execute(sql, values)

db.commit()
print(f"✅ Success! 50 incidents injected. Your AI now has 'historical memory'.")
cursor.close()
db.close()