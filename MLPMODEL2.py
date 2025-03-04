import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.metrics import classification_report


# Load the dataset
df = pd.read_csv('downloads/NUMERICAL_DATA_final_with_outliers_with_weather/NUMERICAL_DATA_final_with_outliers_with_weather.csv')
# df_sampled = df.sample(n=100000, random_state=42)  # Adjust the sample size as needed

# Define feature sets
features_delayed_status = [
    "Origin_DestPair", "DOT_CODE", "CRS_ELAPSED_TIME", "average_delay_flight_route",
    "crs_arr_military_time", "CRS_ARR_TIME", "Time_DistancePair", "DISTANCE",
    "crs_dep_military_hour", "CRS_DEP_TIME", "crs_dep_military_time"
]

features_dep_delay = features_delayed_status + ['Predicted_Delayed_Status','route_delay_rank','average_airline_delay','hourly_origin_dest_average']
# 'average_airline_delay', 'hourly_origin_dest_average']

# Step 1: Train and evaluate the classification model for Delayed_Status
X_classification = df[features_delayed_status]
y_delayed_status = df["Delayed_Status"]

X_train_class, X_test_class, y_train_class, y_test_class = train_test_split(
    X_classification, y_delayed_status, test_size=0.2, random_state=42
)

scaler_class = StandardScaler()
X_train_class = scaler_class.fit_transform(X_train_class)
X_test_class = scaler_class.transform(X_test_class)

# from imblearn.over_sampling import SMOTE
# smote = SMOTE(random_state=42)

# # Resample the training data
# X_train_class_resampled, y_train_class_resampled = smote.fit_resample(X_train_class, y_train_class)
from imblearn.over_sampling import ADASYN

# Resample the training data using ADASYN
adasyn = ADASYN(random_state=42)
X_train_class_resampled, y_train_class_resampled = adasyn.fit_resample(X_train_class, y_train_class)




model_delayed_status = MLPClassifier(
    hidden_layer_sizes=(100, 100), max_iter=500, activation='relu', solver='adam', random_state=42
)
model_delayed_status.fit(X_train_class_resampled, y_train_class_resampled)

# Evaluate classification model
y_pred_class = model_delayed_status.predict(X_test_class)
classification_accuracy = (y_test_class == y_pred_class).mean()

print("Delayed Status Classification Model Evaluation Metrics:")
print(f"Accuracy: {classification_accuracy:.2%}")


# Print the classification report
print("\nClassification Report:")
print(classification_report(y_test_class, y_pred_class))

# Predict Delayed_Status for the entire dataset
df['Predicted_Delayed_Status'] = model_delayed_status.predict(
    scaler_class.transform(df[features_delayed_status])
)

# Step 2: Train and evaluate the regression model for DEP_DELAY
X_regression = df[features_dep_delay]
y_dep_delay = df["DEP_DELAY"]

X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(
    X_regression, y_dep_delay, test_size=0.2, random_state=42
)

scaler_reg = StandardScaler()
X_train_reg = scaler_reg.fit_transform(X_train_reg)
X_test_reg = scaler_reg.transform(X_test_reg)

model_dep_delay = MLPRegressor(
    hidden_layer_sizes=(100, 100), max_iter=500, activation='relu', solver='adam', random_state=42
)
model_dep_delay.fit(X_train_reg, y_train_reg)

# Evaluate regression model
y_pred_reg = model_dep_delay.predict(X_test_reg)

mae_dep_delay = mean_absolute_error(y_test_reg, y_pred_reg)
mse_dep_delay = mean_squared_error(y_test_reg, y_pred_reg)
r2_dep_delay = r2_score(y_test_reg, y_pred_reg)

print("\nDEP_DELAY Regression Model Evaluation Metrics:")
print(f"Mean Absolute Error (MAE): {mae_dep_delay:.2f}")
print(f"Mean Squared Error (MSE): {mse_dep_delay:.2f}")
print(f"R² Score: {r2_dep_delay:.2f}")

# Example prediction with new input values
example_input = pd.DataFrame({
    "Origin_DestPair": [0],
    "DOT_CODE": [20304],
    "CRS_ELAPSED_TIME": [900],
    "average_delay_flight_route": [4.54],
    "crs_arr_military_time": [1427],
    "CRS_ARR_TIME": [867],
    "Time_DistancePair": [346800],
    "DISTANCE": [400],
    "crs_dep_military_hour": [12],
    "CRS_DEP_TIME": [800],
    "crs_dep_military_time": [1400],
})

# Predict Delayed_Status for example input
example_input_scaled_class = scaler_class.transform(example_input[features_delayed_status])
example_input['Predicted_Delayed_Status'] = model_delayed_status.predict(example_input_scaled_class)



# Group by Origin_DestPair and Delayed_Status
grouped_data = df.groupby(['Origin_DestPair', 'Delayed_Status'])['route_delay_rank'].median().reset_index()
grouped_data = grouped_data.pivot(index='Origin_DestPair', columns='Delayed_Status', values='route_delay_rank').reset_index()
print(grouped_data.columns)

# Fill missing status columns with default values
for status in [-1, 0, 1]:
    if status not in grouped_data.columns:
        grouped_data[status] = 0.5  

# Calculate balanced_route_delay_rank
grouped_data['balanced_route_delay_rank'] = (
    grouped_data[-1] * 0.5 + grouped_data[0] * 0.25 + grouped_data[1] * 0.25
)
# route_delay_rank calculate

example_input['route_delay_rank'] = example_input['Origin_DestPair'].map(
    grouped_data.set_index('Origin_DestPair')['balanced_route_delay_rank'].to_dict()
).fillna(0.5)  # Default to 0.5 if no match

print("route_delay_rank: ", example_input['route_delay_rank'])

# average_airline_delay calculate 
example_input['average_airline_delay'] =example_input['DOT_CODE'].map(
    df.groupby('DOT_CODE')['average_airline_delay'].mean()
)


example_pair = example_input.loc[0, 'Origin_DestPair']
example_hour = example_input.loc[0, 'crs_dep_military_hour']

# Group historical data by 'Origin_DestPair' and 'crs_dep_military_hour'
hourly_grouped = df.groupby(['Origin_DestPair', 'crs_dep_military_hour', 'Delayed_Status'])['hourly_origin_dest_average'].median().reset_index()
hourly_grouped = hourly_grouped.pivot(index=['Origin_DestPair', 'crs_dep_military_hour'], columns='Delayed_Status', values='hourly_origin_dest_average').reset_index()
hourly_grouped.fillna(0.5, inplace=True)

hourly_grouped['balanced_hourly_origin_dest_average'] = (
    hourly_grouped[-1] * 0.33 + hourly_grouped[0] * 0.33 + hourly_grouped[1] * 0.33
)

# hourly_origin_dest_average calulcate
example_input['hourly_origin_dest_average'] = example_input.set_index(['Origin_DestPair', 'crs_dep_military_hour']
).index.map(hourly_grouped.set_index(['Origin_DestPair', 'crs_dep_military_hour'])['balanced_hourly_origin_dest_average'].to_dict()).fillna(0.5)



# Predict DEP_DELAY using regression model
example_input_scaled_reg = scaler_reg.transform(example_input[features_dep_delay])
predicted_dep_delay = model_dep_delay.predict(example_input_scaled_reg)

print(f"\nExample Prediction:")
print(f"Predicted Departure Delay: {predicted_dep_delay[0]:.2f} minutes")
