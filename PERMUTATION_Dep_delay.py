from sklearn.inspection import permutation_importance
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras import backend as K

# list permutation importance between target "DEP_DELAY" and the features to determine what columns to include
data = pd.read_csv('downloads/NUMERICAL_DATA_final_with_outliers_with_weather/NUMERICAL_DATA_final_with_outliers_with_weather.csv')

features = ['DISTANCE', 'crs_dep_military_time', 'crs_arr_military_time',
            'crs_dep_military_hour', 'route_delay_rank', 'average_delay_flight_route', 'average_airline_delay',
            'hourly_origin_dest_average', 'route_hour_delay_rank', 'Time_DistancePair', 'OriginAirportID',
            'DestAirportID', 'Year', 'Month', 'CRS_DEP_TIME', 'CRS_ARR_TIME', 'CRS_ELAPSED_TIME']
target = 'DEP_DELAY'

X = data[features].fillna(0)
y = data[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

model = Sequential([
    Dense(64, activation='relu', input_dim=X_train.shape[1]),
    Dense(32, activation='relu'),
    Dense(1)  # Regression output layer
])
model.compile(optimizer='adam', loss='mse', metrics=['mae'])

model.fit(X_train, y_train, epochs=5, batch_size=32, verbose=0)

def get_predictions(model, X):
    return model.predict(X)

perm_importance = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42, scoring='neg_mean_squared_error')

importances = perm_importance.importances_mean


sorted_indices = np.argsort(importances)[::-1]

print("Feature importances (from greatest to least):")
for idx in sorted_indices:
    print(f"{features[idx]}: {importances[idx]:.4f}")
