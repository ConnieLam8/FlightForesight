from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.metrics import make_scorer, f1_score
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
from sklearn.model_selection import cross_val_score
import time

# Start the timer
start_time = time.time()

# Load your data
data = pd.read_csv('NUMERICAL_DATA_final_new_features_with_weather_2019_adjacent.csv')

# Assuming you have a 'DelayTime' column to create labels
# Create the 'Delayed_Status' column based on 'DelayTime'
data['delayed_status'] = data['DEP_DELAY'].apply(lambda x: 1 if x < 0 else (-1 if x > 0 else 0))


# Features (X) and target (y)
# The X inputs below are the working one to give 89% accuracy
# X = data[['DOT_CODE', 'FL_NUMBER', 'bad_weather_indicator', 'CRS_DEP_TIME',
#              'DISTANCE', 'CRS_DEP_TIME', 'CRS_ARR_TIME', 'AIRLINE_DOTNUMERICAL', 'CRS_ELAPSED_TIME',
#              'Origin_DestPair', 'Time_DistancePair', 'crs_arr_military_hour',
#              'crs_dep_military_hour', 'crs_dep_military_time',
#              'crs_arr_military_time', 'altimer_setting', 'dew_temperature_point', 'dry_temperature', 'relative_humidity',
#              'visibility', 'feels_like_temperature', 'sea_level_pressure',
#              'precipiation', 'average_airline_delay', 'average_delay_flight_route', 'airport_region_group_encoded',
#              'route_cluster', 'avg_route_hour_delay', 'route_delay_rank', 'route_delay_std']]
X = data[['DOT_CODE', 'DISTANCE', 'Origin_DestPair', 'crs_dep_military_time', 'crs_arr_military_time', 
          'airport_region_group_encoded', 'crs_dep_military_hour', 'route_delay_rank',
          'average_airline_delay', 'hourly_origin_dest_average', 'route_hour_delay_rank']]

y = data['delayed_status']

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Initialize a classifier (RandomForest in this case)
class_weights = {-1: 1.7777777777777777, 0: 7, 1: 1}
model = RandomForestClassifier(n_estimators=200, max_depth=10, class_weight='balanced')

'''
///////// Conduct a Grid Search to find the best class_weights values /////////
'''

# Set the range for the class weights
weights = np.linspace(0.0,0.99,200)

# Create a dictionary grid for grid search - Only creates a param grid for two values
param_grid = {'class_weight': [{0: x, 1: 1.0 - x} for x in weights]}

# Define specific values for weights for 3 values
weights_2 = np.linspace(0.0, 4.0, 10) # Try different values 

param_grid_2 = {
    'class_weight': [
        {-1: w1, 0: w2, 1: 1.0}
        for w1 in weights_2
        for w2 in weights_2
    ]    
}

# Use a custom scorer for multiclass F1
f1_scorer = make_scorer(f1_score, average='weighted')

# Setting up a GridSearchCV
gridsearch = GridSearchCV(
    estimator=model,
    param_grid=param_grid_2,
    cv=StratifiedKFold(n_splits=5),
    n_jobs=-1,
    scoring=f1_scorer,   # Use the updated scorer
    verbose=2
)

# Fitting the GridSearchCV to the training data
gridsearch.fit(X_train, y_train)

# Get the best parameters and score
print("Best parameters:", gridsearch.best_params_)
print("Best cross-validation score:", gridsearch.best_score_)

# Plotting the score for different values of weight
sns.set_style('whitegrid')
plt.figure(figsize=(12,8))
weigh_data = pd.DataFrame({
    'score': gridsearch.cv_results_['mean_test_score'],
    'weight': (1 - weights)
})
sns.lineplot(x=weigh_data['weight'], y=weigh_data['score'])
plt.xlabel('Weight for Class 1')
plt.ylabel('F1 Score')
plt.xticks([round(i / 10, 1) for i in range(0, 11, 1)])
plt.title('Scoring for Different Class Weights', fontsize=24)
plt.show()

# Apply SMOTE to balance the training data (many more on-time rows vs. delayed rows)
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

# Train the model
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# ///////////////////////////////////////////////////////
# Check the feature importance within the model
importances = model.feature_importances_

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

# Evaluate the model
print("Classification Report:\n", classification_report(y_test, y_pred))

# Predict the model accuracy score
accuracy = model.score(X_test, y_test)

print("Score:", accuracy)

'''
///// Test the output with personal input features /////
'''
# Inquiry Data needed to make input features
inquiry_data = pd.DataFrame({
    'ORIGIN': ['JFK'],
    'DEST': ['LAX'],
    'AIRLINE': ['SkyWest Airlines Inc.']
})

# Example prediction
example_input = pd.DataFrame({
    'DOT_CODE': [19790],
    'DISTANCE': [2475],
    'Origin_DestPair': [1621],
    'crs_dep_military_time': [955],
    'crs_arr_military_time': [1325],
    'airport_region_group_encoded': [2],
    'crs_dep_military_hour': [9]
})

'''
///////// Calculate route_delay_rank /////////
'''
# Group by Origin_DestPair and delayed_status. Calculate separate medians for each (-1, 0, 1)
grouped_data = data.groupby(['Origin_DestPair', 'delayed_status'])['route_delay_rank'].median().reset_index()
grouped_data = grouped_data.pivot(index='Origin_DestPair', columns='delayed_status', values='route_delay_rank').reset_index()
grouped_data.fillna(0.5, inplace=True)  # Default to neutral rank where no data exists

# Balance the contributions
grouped_data['balanced_route_delay_rank'] = (
    grouped_data[-1] * 0.5 + grouped_data[0] * 0.25 + grouped_data[1] * 0.25
)

# Map the balances values
example_input['route_delay_rank'] = example_input['Origin_DestPair'].map(
    grouped_data.set_index('Origin_DestPair')['balanced_route_delay_rank']
)

example_pair = example_input.loc[0, 'Origin_DestPair']

print("Route_delay_rank:", example_input['route_delay_rank'])

example_input['average_airline_delay'] = example_input['DOT_CODE'].map(
    data.groupby('DOT_CODE')['average_airline_delay'].mean()
)

example_pair = example_input.loc[0, 'Origin_DestPair']
example_hour = example_input.loc[0, 'crs_dep_military_hour']

# Group historical data by 'Origin_DestPair' and 'crs_dep_military_hour'
hourly_grouped = data.groupby(['Origin_DestPair', 'crs_dep_military_hour', 'Delayed_Status'])['hourly_origin_dest_average'].median().reset_index()
hourly_grouped = hourly_grouped.pivot(index=['Origin_DestPair', 'crs_dep_military_hour'], columns='Delayed_Status', values='hourly_origin_dest_average').reset_index()
hourly_grouped.fillna(0.5, inplace=True)

# Balance the contributions
hourly_grouped['balanced_hourly_origin_dest_average'] = (
    hourly_grouped[-1] * 0.33 + hourly_grouped[0] * 0.33 + hourly_grouped[1] * 0.33
)

# Map the balances values
example_input['hourly_origin_dest_average'] = example_input.set_index(['Origin_DestPair', 'crs_dep_military_hour']
).index.map(hourly_grouped.set_index(['Origin_DestPair', 'crs_dep_military_hour'])['balanced_hourly_origin_dest_average'].to_dict()).fillna(0.5)

hourly_grouped_2 = data.groupby(['Origin_DestPair', 'crs_dep_military_hour'])['route_hour_delay_rank']

# Filter historical data to only the origin-destination-hour pair we're looking for
filtered_historical_hourly_data_2 = hourly_grouped_2.get_group((example_pair, example_hour)) if (example_pair, example_hour) in hourly_grouped_2.groups else None

if not filtered_historical_hourly_data_2.empty and filtered_historical_hourly_data_2 is not None:
    median_hourly_route_2 = filtered_historical_hourly_data_2.median()
else:
    # Default value if no data exists for the pair
    median_hourly_route_2 = 0.5

example_input['route_hour_delay_rank'] = median_hourly_route_2

# /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
predicted_delay = model.predict(example_input)
print(f'Predicted Delay Status: {predicted_delay[0]:.2f} status')

# End the timer
end_time = time.time()

# Calculate elapsed time
elapsed_time = end_time - start_time
print(f"Elapsed time: {elapsed_time:.2f} seconds")