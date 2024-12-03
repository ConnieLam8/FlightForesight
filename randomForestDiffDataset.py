#tried random forest on another set of data 
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score


df = pd.read_csv("full_data_flightdelay.csv")
# encode the categorical data
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()

def clean_labels_encoder(list_of_labels, df):
    for label in list_of_labels:
        df[label] = le.fit_transform(df[label])
    return df

# clean the labels
list_of_labels = ['CARRIER_NAME', 'DEPARTING_AIRPORT', 'PREVIOUS_AIRPORT', 'DEP_TIME_BLK']
df = clean_labels_encoder(list_of_labels, df)

df.fillna(df.mean(), inplace=True)

X = df.iloc[:, [0, 1, 3, 8, 9, 10, 17, 20, 21, 22, 23, 24, 25]].values
y = df.iloc[:, 2].values

def scale_data(X):
    scaler = MinMaxScaler()
    X_scaler = scaler.fit_transform(X)
    return X_scaler

X_scaler = scale_data(X)
df = pd.DataFrame(X_scaler)

X_train, X_test, y_train, y_test = train_test_split(X_scaler, y, test_size=0.2, random_state=42)

def train_model_and_print_r2_score(model, X_train, y_train, X_test, y_test):
    model.fit(X_train, y_train)
    
    # Predict the test data
    predict_test = model.predict(X_test)
    
    # Calculate R² score
    r2 = r2_score(y_test, predict_test)
    
    print('R² Score  ', r2)

rf = RandomForestRegressor(n_estimators=100, random_state=0, oob_score=True)

# Update the models list
models = [rf]

for model in models:
    train_model_and_print_r2_score(model, X_train, y_train, X_test, y_test)

