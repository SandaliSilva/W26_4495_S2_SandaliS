import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sqlalchemy import create_engine
import urllib.parse
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report

# 1. Setup Connection
password = urllib.parse.quote_plus('@Umnotinto23')
engine = create_engine(f'mysql+mysqlconnector://root:{password}@localhost/safesight_db')

# 2. Load and Prepare Data
df = pd.read_sql("SELECT department, severity, incident_datetime FROM incidents", engine)
df['incident_datetime'] = pd.to_datetime(df['incident_datetime'])
df['day_of_week'] = df['incident_datetime'].dt.dayofweek
df['month'] = df['incident_datetime'].dt.month

le = LabelEncoder()
df['dept_n'] = le.fit_transform(df['department'])
df['severity_n'] = df['severity'].apply(lambda x: 1 if x in ['Critical', 'High'] else 0)

# --- 3. THE HEATMAP (Correlation) ---
plt.figure(figsize=(10, 8))
# Checking how features like 'month' or 'dept' correlate with 'severity'
correlation_matrix = df[['dept_n', 'day_of_week', 'month', 'severity_n']].corr()
sns.heatmap(correlation_matrix, annot=True, cmap='YlOrBr', fmt=".2f")
plt.title('SafeSight Feature Correlation Heatmap')
plt.show()



# --- 4. MODEL TRAINING & EVALUATION ---
X = df[['dept_n', 'day_of_week', 'month']]
y = df['severity_n']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# --- 5. THE CONFUSION MATRIX ---
plt.figure(figsize=(6, 5))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Predicted Stable', 'Predicted High'],
            yticklabels=['Actual Stable', 'Actual High'])
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.title('Random Forest Confusion Matrix')
plt.show()



# --- 6. FEATURE IMPORTANCE ---
importances = pd.Series(model.feature_importances_, index=X.columns)
importances.sort_values().plot(kind='barh', color='#C5A059')
plt.title('What Drives Risk? (Feature Importance)')
plt.show()