#Decision tree model that gave 87% r2 score with pipelines
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import pandas as pd
import numpy as np
from sklearn.model_selection import cross_val_predict

# Read the data
data = pd.read_csv("NUMERICAL_DATA_copy.csv")

# First model: Predicting ARR_DELAY
featuresX_1 = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID",
               "CRS_ARR_TIME", "CRS_DEP_TIME", "DISTANCE", "CRS_ELAPSED_TIME", "DEP_DELAY"]

X_1 = data[featuresX_1].copy()
y_1 = data["ARR_DELAY"]

# Train-test split for the first model
X_train_1, X_test_1, y_train_1, y_test_1 = train_test_split(X_1, y_1, test_size=0.2, random_state=42)

# Pipeline for the first model
pipeline_1 = Pipeline([
    ('scaler', StandardScaler()),         # Scaling
    ('regressor', DecisionTreeRegressor(random_state=0))  # Model
])

# Train the first model
pipeline_1.fit(X_train_1, y_train_1)

# Evaluate the first model
predictions_1 = pipeline_1.predict(X_test_1)
r2_1 = r2_score(y_test_1, predictions_1)
mse_1 = mean_squared_error(y_test_1, predictions_1)  # MSE for ARR_DELAY model
#print(f'First Model R-squared (with DEP_DELAY): {r2_1}')
#print(f'First Model Mean Squared Error (MSE): {mse_1}')

# Predict ARR_DELAY for the entire dataset
data['Predicted_ARR_DELAY'] = cross_val_predict(pipeline_1, X_1, y_1, cv=5)

# Second model: Predicting DEP_DELAY without using DEP_DELAY itself
featuresX_2 = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID",
               "CRS_ARR_TIME", "CRS_DEP_TIME", "DISTANCE", "CRS_ELAPSED_TIME", "Predicted_ARR_DELAY"]

X_2 = data[featuresX_2].copy()
y_2 = data["DEP_DELAY"]

# Train-test split for the second model
X_train_2, X_test_2, y_train_2, y_test_2 = train_test_split(X_2, y_2, test_size=0.2, random_state=42)

# Pipeline for the second model
pipeline_2 = Pipeline([
    ('scaler', StandardScaler()),  # Scaling
    ('regressor', DecisionTreeRegressor(random_state=0))  # Model
])

data['Predicted_DEP_DELAY'] = cross_val_predict(pipeline_2, X_2, y_2, cv=5)

# Train the second model
pipeline_2.fit(X_train_2, y_train_2)

# Evaluate the second model
predictions_2 = pipeline_2.predict(X_test_2)
r2_2 = r2_score(y_test_2, predictions_2)
mse_2 = mean_squared_error(y_test_2, predictions_2)  # MSE for DEP_DELAY model
me_2 = np.mean(y_test_2 - predictions_2)  # Mean Error for DEP_DELAY model
mae_2 = mean_absolute_error(y_test_2, predictions_2)
print(f'Second Model R-squared: {r2_2}')
#print(f'Second Model Mean Squared Error (MSE): {mse_2}')
#print(f'Second Model Mean Error (ME): {me_2}')
print(f'Second Model Mean Absolute Error (MAE): {mae_2}')

# User input for prediction
user_input = {
    "Year": 2022,
    "Month": 7,
    "DayofMonth": 22,
    "OriginAirportID": 99,  # Replace with actual ID
    "DestAirportID": 247,   # Replace with actual ID
    "CRS_ARR_TIME": 1945,      # Scheduled arrival time in minutes
    "CRS_DEP_TIME": 1010,      # Scheduled departure time in minutes
    "DISTANCE": 1020,         # Example distance in miles
    "CRS_ELAPSED_TIME": 118    # Example elapsed time in minutes
}

# Step 2: Fetch DEP_DELAY dynamically for the user input
def fetch_dep_delay_for_input_with_tolerance(user_input, data, tolerance=100):
    matched_row = data[
        (data['CRS_DEP_TIME'].between(user_input['CRS_DEP_TIME'] - tolerance, user_input['CRS_DEP_TIME'] + tolerance)) &
        (data['CRS_ARR_TIME'].between(user_input['CRS_ARR_TIME'] - tolerance, user_input['CRS_ARR_TIME'] + tolerance))
    ]
    if not matched_row.empty:
        return matched_row.iloc[0]['DEP_DELAY']  # Return the first match
    return None


# Fetch DEP_DELAY for user input
user_input["DEP_DELAY"] = fetch_dep_delay_for_input_with_tolerance(user_input, data, tolerance=100)

if user_input["DEP_DELAY"] is None:
    print("No matching DEP_DELAY found for the given input. Cannot predict ARR_DELAY.")
else:
    # Predict ARR_DELAY using the first model
    user_features_1 = pd.DataFrame([user_input])
    predicted_arr_delay = pipeline_1.predict(user_features_1)[0]
    print(f"Predicted Arrival Delay (from First Model): {predicted_arr_delay} minutes")


    # Prepare input for the second model
    user_input["Predicted_ARR_DELAY"] = predicted_arr_delay
    features_for_second_model = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID",
                                 "CRS_ARR_TIME", "CRS_DEP_TIME", "DISTANCE", "CRS_ELAPSED_TIME", "Predicted_ARR_DELAY"]
    user_features_2 = pd.DataFrame([user_input])[features_for_second_model]

    # Predict DEP_DELAY using the second model
    predicted_dep_delay = pipeline_2.predict(user_features_2)[0]
    print(f"Predicted Departure Delay (from Second Model): {predicted_dep_delay} minutes")

    # Compute RMSE for both models
    rmse_1 = np.sqrt(mse_1)
    rmse_2 = np.sqrt(mse_2)

    #print(f'First Model Root Mean Squared Error (RMSE): {rmse_1}')
    #print(f'Second Model Root Mean Squared Error (RMSE): {rmse_2}')
