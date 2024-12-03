# test decisionTreeRegressor with more data leakage precaution with pipelines
# from sklearn.pipeline import Pipeline
# from sklearn.preprocessing import StandardScaler
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.model_selection import cross_val_predict, train_test_split, KFold
# import pandas as pd
# import numpy as np

# # Read the data
# data = pd.read_csv("NUMERICAL_DATA_copy.csv")

# # Step 1: Predict ARR_DELAY
# featuresX_1 = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID",
#                "CRS_ARR_TIME", "CRS_DEP_TIME", "DISTANCE", "CRS_ELAPSED_TIME", "DEP_DELAY"]

# X_1 = data[featuresX_1].copy()
# y_1 = data["ARR_DELAY"]

# # Step 2: Train-test split for independent validation
# train_data, test_data = train_test_split(data, test_size=0.2, random_state=42)

# # Step 3: Define X_train_1 and y_train_1 after splitting
# X_train_1 = train_data[featuresX_1].copy()
# y_train_1 = train_data["ARR_DELAY"]

# # Pipeline for the first model
# pipeline_1 = Pipeline([
#     ('scaler', StandardScaler()),  # Scaling
#     ('regressor', DecisionTreeRegressor(random_state=0))  # Model
# ])

# # Step 4: Generate Predicted_ARR_DELAY using cross-validation on training data only
# kf = KFold(n_splits=5, shuffle=True, random_state=0)
# train_data['Predicted_ARR_DELAY'] = cross_val_predict(pipeline_1, X_train_1, y_train_1, cv=kf)

# # Step 5: Use the predicted ARR_DELAY for the second model
# featuresX_2 = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID",
#                "CRS_ARR_TIME", "CRS_DEP_TIME", "DISTANCE", "CRS_ELAPSED_TIME", "Predicted_ARR_DELAY"]

# # Predict ARR_DELAY for the test data (similar to train data)
# X_train_2 = train_data[featuresX_2].copy()
# y_train_2 = train_data["DEP_DELAY"]

# # After training pipeline_1 on the training data (step 4)
# pipeline_1.fit(X_train_1, y_train_1)  # Train the model on the training data

# # Predict 'Predicted_ARR_DELAY' for both train and test data
# train_data['Predicted_ARR_DELAY'] = pipeline_1.predict(X_train_1)
# test_data['Predicted_ARR_DELAY'] = pipeline_1.predict(test_data[featuresX_1])  # Predict on test data

# # Now you can create X_test_2 using the updated test_data which has the 'Predicted_ARR_DELAY'
# X_test_2 = test_data[featuresX_2].copy()
# y_test_2 = test_data["DEP_DELAY"]

# # Pipeline for the second model
# pipeline_2 = Pipeline([
#     ('scaler', StandardScaler()),  # Scaling
#     ('regressor', DecisionTreeRegressor(random_state=0))  # Model
# ])

# # Train the second model on training data
# pipeline_2.fit(X_train_2, y_train_2)

# # Evaluate the second model
# predictions_test = pipeline_2.predict(X_test_2)
# r2_test = pipeline_2.score(X_test_2, y_test_2)

# print(f'Second Model R-squared on Test Data: {r2_test}')

# # Step 8: User Input Prediction (No retraining)
# user_input = {
#     "Year": 2022,
#     "Month": 7,
#     "DayofMonth": 22,
#     "OriginAirportID": 99,  # Replace with actual ID
#     "DestAirportID": 247,   # Replace with actual ID
#     "CRS_ARR_TIME": 720,      # Scheduled arrival time in minutes
#     "CRS_DEP_TIME": 500,      # Scheduled departure time in minutes
#     "DISTANCE": 1020,         # Example distance in miles
#     "CRS_ELAPSED_TIME": 118,    # Example elapsed time in minutes
# }

# # Step 8.1: Fetch DEP_DELAY dynamically
# def fetch_dep_delay_for_input_with_tolerance(user_input, data, tolerance=100):
#     matched_row = data[
#         (data['CRS_DEP_TIME'].between(user_input['CRS_DEP_TIME'] - tolerance, user_input['CRS_DEP_TIME'] + tolerance)) &
#         (data['CRS_ARR_TIME'].between(user_input['CRS_ARR_TIME'] - tolerance, user_input['CRS_ARR_TIME'] + tolerance))
#     ]
#     if not matched_row.empty:
#         return matched_row.iloc[0]['DEP_DELAY']  # Return the first match
#     return None

# user_input["DEP_DELAY"] = fetch_dep_delay_for_input_with_tolerance(user_input, data, tolerance=100)

# if user_input["DEP_DELAY"] is None:
#     print("No matching DEP_DELAY found for the given input. Cannot predict ARR_DELAY.")
# else:
#     # Step 8.2: Predict ARR_DELAY for user input using pipeline_1
#     pipeline_1.fit(X_train_1, y_train_1)  # Fit the first model
#     user_features_1 = pd.DataFrame([user_input])[featuresX_1]
#     predicted_arr_delay = pipeline_1.predict(user_features_1)[0]
#     print(f"Predicted Arrival Delay (First Model): {predicted_arr_delay} minutes")

#     # Step 8.3: Use predicted ARR_DELAY in the second model
#     user_input["Predicted_ARR_DELAY"] = predicted_arr_delay
#     features_for_second_model = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID",
#                                  "CRS_ARR_TIME", "CRS_DEP_TIME", "DISTANCE", "CRS_ELAPSED_TIME", "Predicted_ARR_DELAY"]

#     user_features_2 = pd.DataFrame([user_input])[features_for_second_model]
#     predicted_dep_delay = pipeline_2.predict(user_features_2)[0]
#     print(f"Predicted Departure Delay (Second Model): {predicted_dep_delay} minutes")


from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import pandas as pd
import numpy as np
from sklearn.model_selection import cross_val_predict

# Read the data
data = pd.read_csv("NUMERICAL_DATA_final_with_outliers_with_weather.csv")

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
    ('regressor', DecisionTreeRegressor(max_depth=1000, min_samples_split=10, min_samples_leaf=5, random_state=0))  # Model
])

# Use cross_val_predict only on the training set
train_data_1 = data.loc[X_train_1.index].copy()  # Subset of training data
test_data_1 = data.loc[X_test_1.index].copy()    # Subset of test data
train_data_1['Predicted_ARR_DELAY'] = cross_val_predict(pipeline_1, X_train_1, y_train_1, cv=5)

# Train the first pipeline on the entire training set
pipeline_1.fit(X_train_1, y_train_1)

# Predict ARR_DELAY for the test set
test_data_1['Predicted_ARR_DELAY'] = pipeline_1.predict(X_test_1)

# Optional: Combine predictions back into the original dataset
data.loc[train_data_1.index, 'Predicted_ARR_DELAY'] = train_data_1['Predicted_ARR_DELAY']
data.loc[test_data_1.index, 'Predicted_ARR_DELAY'] = test_data_1['Predicted_ARR_DELAY']

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
    ('regressor', DecisionTreeRegressor(max_depth=1000, min_samples_split=10, min_samples_leaf=5, random_state=0))  # Model
])

# Use cross_val_predict only on the training set for the second model
train_data_2 = data.loc[X_train_2.index]  # Subset of training data for the second model
test_data_2 = data.loc[X_test_2.index]    # Subset of test data for the second model
train_data_2['Predicted_DEP_DELAY'] = cross_val_predict(pipeline_2, X_train_2, y_train_2, cv=5)

# Train the second pipeline on the entire training set
pipeline_2.fit(X_train_2, y_train_2)

# Predict DEP_DELAY for the test set
test_data_2['Predicted_DEP_DELAY'] = pipeline_2.predict(X_test_2)

# Optional: Combine predictions back into the original dataset
data.loc[train_data_2.index, 'Predicted_DEP_DELAY'] = train_data_2['Predicted_DEP_DELAY']
data.loc[test_data_2.index, 'Predicted_DEP_DELAY'] = test_data_2['Predicted_DEP_DELAY']

# Evaluate the second model
predictions_2 = pipeline_2.predict(X_test_2)
r2_2 = r2_score(y_test_2, predictions_2)
mse_2 = mean_squared_error(y_test_2, predictions_2)
mae_2 = mean_absolute_error(y_test_2, predictions_2)
print(f'Second Model R-squared: {r2_2}')
print(f'Second Model Mean Squared Error (MSE): {mse_2}')
print(f'Second Model Mean Absolute Error (MAE): {mae_2}')

# User input for prediction
user_input = {
    "Year": 2022,
    "Month": 7,
    "DayofMonth": 22,
    "OriginAirportID": 99,  # Replace with actual ID
    "DestAirportID": 247,   # Replace with actual ID
    "CRS_ARR_TIME": 1179,      # Scheduled arrival time in minutes
    "CRS_DEP_TIME": 1061,      # Scheduled departure time in minutes
    "DISTANCE": 1020,         # Example distance in miles
    "CRS_ELAPSED_TIME": 118    # Example elapsed time in minutes
}

# Step 2: Fetch DEP_DELAY dynamically for the user input
def fetch_dep_delay_for_input_with_tolerance(user_input, train_data_2, tolerance=100):
    matched_row = data[
        (data['CRS_DEP_TIME'].between(user_input['CRS_DEP_TIME'] - tolerance, user_input['CRS_DEP_TIME'] + tolerance)) &
        (data['CRS_ARR_TIME'].between(user_input['CRS_ARR_TIME'] - tolerance, user_input['CRS_ARR_TIME'] + tolerance))
    ]
    if not matched_row.empty:
        return matched_row.iloc[0]['DEP_DELAY']  # Return the first match
    return None

# Fetch DEP_DELAY for user input
user_input["DEP_DELAY"] = fetch_dep_delay_for_input_with_tolerance(user_input, train_data_2, tolerance=100)

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

