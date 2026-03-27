import pandas as pd
from sqlalchemy import create_engine
import urllib.parse
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC

# Setup
password = urllib.parse.quote_plus('@Umnotinto23')
engine = create_engine(f'mysql+mysqlconnector://root:{password}@localhost/safesight_db')

# 1. Load and Prepare Data
df = pd.read_sql("SELECT department, severity, incident_datetime FROM incidents", engine)
df['day_of_week'] = pd.to_datetime(df['incident_datetime']).dt.dayofweek
df['month'] = pd.to_datetime(df['incident_datetime']).dt.month
le = LabelEncoder()
df['dept_n'] = le.fit_transform(df['department'])

X = df[['dept_n', 'day_of_week', 'month']]
y = df['severity'].apply(lambda x: 1 if x in ['Critical', 'High'] else 0)

# 2. Define the Models to Test
models = [
    ('LogReg', LogisticRegression()),
    ('DecTree', DecisionTreeClassifier()),
    ('RanForest', RandomForestClassifier(n_estimators=100)),
    ('SVM', SVC())
]

# 3. Compare them using Cross-Validation
print("--- Model Selection Results ---")
for name, model in models:
    # cv=5 means it tests the model 5 different times on 5 different slices of data
    scores = cross_val_score(model, X, y, cv=5)
    print(f"{name} Accuracy: {scores.mean() * 100:.2f}% (+/- {scores.std() * 2:.2f})")