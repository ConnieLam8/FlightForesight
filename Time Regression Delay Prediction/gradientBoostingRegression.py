import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
import time
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import cross_val_score
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Start the timer
start_time = time.time()

# Load the data
df = pd.read_csv('NUMERICAL_DATA_final_with_outliers_with_weather.csv')

# Selecting features and target
X = df[['delayed_status', 'DOT_CODE', 'DISTANCE', 'Origin_DestPair', 'crs_dep_military_time', 'crs_arr_military_time', 'visibility',
          'airport_region_group_encoded', 'crs_dep_military_hour', 'route_delay_rank', 'average_delay_flight_route',
          'average_airline_delay', 'hourly_origin_dest_average', 'route_hour_delay_rank', 'Time_DistancePair']]
y = df[['DEP_DELAY']]

# Splitting the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# //////////////////////////////////
# Heat Map
# Compute the correlation matrix
correlation_matrix = df.corr()

# Print the correlation of features with the target variable
print(correlation_matrix['DEP_DELAY'].sort_values(ascending=False))  # Assuming 'delay' is your target

plt.figure(figsize=(10, 10))
sns.heatmap(correlation_matrix, annot = True, cmap='coolwarm', fmt=".2f")
plt.show()

# Creating the model pipeline
model = Pipeline(steps=[
    ('regressor', XGBRegressor(reg_lambda=1, reg_alpha=0.1, n_estimators=200, learning_rate=0.15, max_depth=8, random_state=42))
])

# Training the model
model.fit(X_train, y_train)

# Making predictions
y_pred = model.predict(X_test)

# ///////////////////////////////////////////////////////
# Access the regressor inside of the pipeline
gb_model = model.named_steps['regressor']

# Check the feature importance within the model
importances = gb_model.feature_importances_

# Create a DataFrame to show features and their importance scores
feature_importances = pd.DataFrame({
    'Feature': X.columns,
    'Importance': importances
})

# Sort the DataFrame by importance
feature_importances = feature_importances.sort_values(by='Importance', ascending=False)

print("--Feature Importance-- ")
print(feature_importances)

# ///////////////////////////////////////////////////////

# Evaluating the model
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error: {mse:.2f}')

# Normalized Mean Squared Error
normalized_mse = mse / np.var(y_test)  # Variance-normalized MSE
print("Normalized Mean Squared Error: ", normalized_mse)

# Evaluate the r^2 value of the model
rs = r2_score(y_test, y_pred)
print(f'R Squared Value: {rs:.2f}')

# Evaluate model performance with different feature sets
scores = cross_val_score(model, X_train, y_train, cv=5)
print(f'Cross-validation scores: {scores}')

'''
//////// Make an example prediction ////////
'''
example_input = pd.DataFrame({
    'delayed_status': [-1],
    'DOT_CODE': [19790],
    'DISTANCE': [2475],
    'Origin_DestPair': [1621],
    'crs_dep_military_time': [955],
    'crs_arr_military_time': [1325],
    'visibility': [10],
    'airport_region_group_encoded': [2],
    'crs_dep_military_hour': [9]
})

# route_delay_rank
# Group by Origin_DestPair and delayed_status. Calculate separate medians for each (-1, 0, 1)
grouped_data = df.groupby(['Origin_DestPair', 'delayed_status'])['route_delay_rank'].median().reset_index()
grouped_data = grouped_data.pivot(index='Origin_DestPair', columns='delayed_status', values='route_delay_rank').reset_index()
grouped_data.fillna(0.5, inplace=True)  # Default to neutral rank where no data exists

# Balance the contributions
grouped_data['balanced_route_delay_rank'] = (
    grouped_data[-1] * 0.33 + grouped_data[0] * 0.33 + grouped_data[1] * 0.33
)

# Map the balances values
example_input['route_delay_rank'] = example_input['Origin_DestPair'].map(
    grouped_data.set_index('Origin_DestPair')['balanced_route_delay_rank']
)

# average_delay_flight_route
example_input['average_delay_flight_route'] = example_input['Origin_DestPair'].map(
    df.groupby('Origin_DestPair')['average_delay_flight_route'].mean()
)

# average_airline_delay
example_input['average_airline_delay'] = example_input['DOT_CODE'].map(
    df.groupby('DOT_CODE')['average_airline_delay'].mean()
)

# hourly_origin_dest_average
example_pair = example_input.loc[0, 'Origin_DestPair']
example_hour = example_input.loc[0, 'crs_dep_military_hour']

# Group historical data by 'Origin_DestPair' and 'crs_dep_military_hour'
hourly_grouped = df.groupby(['Origin_DestPair', 'crs_dep_military_hour'])['hourly_origin_dest_average']

# Filter historical data to only the origin-destination-hour pair we're looking for
filtered_historical_hourly_data = hourly_grouped.get_group((example_pair, example_hour)) if (example_pair, example_hour) in hourly_grouped.groups else None

if not filtered_historical_hourly_data.empty and filtered_historical_hourly_data is not None:
    median_hourly_route = filtered_historical_hourly_data.median()
    print("median_hourly_route: ", median_hourly_route)
else:
    # Default value if no data exists for the pair
    median_hourly_route = 0.5

example_input['hourly_origin_dest_average'] = median_hourly_route

# route_hour_delay_rank
hourly_grouped_2 = df.groupby(['Origin_DestPair', 'crs_dep_military_hour'])['route_hour_delay_rank']

# Filter historical data to only the origin-destination-hour pair we're looking for
filtered_historical_hourly_data_2 = hourly_grouped_2.get_group((example_pair, example_hour)) if (example_pair, example_hour) in hourly_grouped_2.groups else None

if not filtered_historical_hourly_data_2.empty and filtered_historical_hourly_data_2 is not None:
    median_hourly_route_2 = filtered_historical_hourly_data_2.median()
    print("median_hourly_route: ", median_hourly_route_2)
else:
    # Default value if no data exists for the pair
    median_hourly_route_2 = 0.5

example_input['route_hour_delay_rank'] = median_hourly_route_2

# Time_DistancePair
example_input['Time_DistancePair'] = 1472625

# Predict the delay time
predicted_delay = model.predict(example_input)
print(f'Predicted Delay Time: {predicted_delay[0]:.2f} minutes')


'''
//////// End of example prediction ////////
'''

'''
//////// Evaluate the prediction accuracy ////////
'''
actual_value = 47  # Replace with the true value
predicted_value = model.predict(example_input)[0]
error = actual_value - predicted_value
print(f"Error: {error:.2f}")


# End the timer
end_time = time.time()

# Calculate elapsed time
elapsed_time = end_time - start_time
print(f"Elapsed time: {elapsed_time:.2f} seconds")