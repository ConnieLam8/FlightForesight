import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_sample_weight
from sklearn.pipeline import Pipeline
import numpy as np
from xgboost import XGBRegressor
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.model_selection import cross_val_score
import time

# Start the timer
start_time = time.time()

# Load your data
data = pd.read_csv('NUMERICAL_DATA_final_with_outliers_with_weather.csv')

def train_sequential_model(X_class, X_reg, y_classification, y_regression):
    '''
    ////////////////////////////////////////////////////////////////////////////////////
                    Step 1: Gradient Boosting Classification Model
    ////////////////////////////////////////////////////////////////////////////////////
    '''
    # Split into train and test sets
    X_class_train, X_class_test, y_class_train, y_class_test = train_test_split(
            X_class, y_classification, test_size=0.2, random_state=42
        )

    X_reg_train, X_reg_test, y_reg_train, y_reg_test = train_test_split(
        X_reg, y_regression, test_size=0.2, random_state=42
    )

    # Initialize the Gradient Boosting Classifier
    gb_classifier = GradientBoostingClassifier(random_state=42)

    # Fit the model to the training data
    gb_classifier.fit(X_class_train, y_class_train)

    # Predict the classification target
    y_class_pred_check =  gb_classifier.predict(X_class_test)

    print("y_class_pred_check: ", y_class_pred_check)

    print("Classification Report:\n", classification_report(y_class_test, y_class_pred_check))
    # Predict the model accuracy score
    accuracy = gb_classifier.score(X_class_test, y_class_test)
    print("Gradient Boosting Score: ", accuracy)

    # Predict on the test data
    delay_status_train = gb_classifier.predict(X_class_train).reshape(-1, 1)
    delay_status_test = gb_classifier.predict(X_class_test).reshape(-1, 1)

    # Augment Regression Features with Delay Status from Classification
    X_reg_train_augmented = np.hstack([X_reg_train, delay_status_train])
    X_reg_test_augmented = np.hstack([X_reg_test, delay_status_test])


    '''
    ////////////////////////////////////////////////////////////////////////////////////
                    Step 2: Gradient Boosting Regression Model
    ////////////////////////////////////////////////////////////////////////////////////
    '''
    # Train the regression model
    gb_regressor = Pipeline(steps=[
        ('regressor', XGBRegressor(n_estimators=200, learning_rate=0.1, max_depth=8, random_state=42))
    ])

    gb_regressor.fit(X_reg_train_augmented, y_reg_train)
    print("Shape of X_reg_train_augmented: ", X_reg_train_augmented.shape)
    print("Shape of y_reg_train: ", y_reg_train.shape)
    # print("Columns in X_reg_train_augmented: ", gb_regressor.named_steps['regressor'].get_feature_names_out())

    # Predict the regression target
    y_pred = gb_regressor.predict(X_reg_test_augmented)

    # Evaluate the r^2 value of the model
    rs = r2_score(y_reg_test, y_pred)
    print(f'R Squared Value: {rs:.2f}')

    return gb_classifier, gb_regressor, y_pred, y_reg_test, rs


'''
////////////////////////////////////////////////////////////////////////////////////
                        Final Step: Test Prediction Input
////////////////////////////////////////////////////////////////////////////////////
'''
# Create the 'Flight_Status' column based on 'DelayTime'
X_class = data[['DOT_CODE', 'DISTANCE', 'Origin_DestPair', 'crs_dep_military_time', 'crs_arr_military_time', 
                'airport_region_group_encoded', 'crs_dep_military_hour', 'route_delay_rank',
                'average_airline_delay', 'hourly_origin_dest_average']]
y_classification = data['Delayed_Status']

X_reg = data[['DOT_CODE', 'DISTANCE', 'Origin_DestPair', 'crs_dep_military_time', 'crs_arr_military_time',
              'airport_region_group_encoded', 'crs_dep_military_hour', 'route_delay_rank',
              'average_airline_delay', 'hourly_origin_dest_average', 'Time_DistancePair',
              'average_delay_flight_route']]
print("X_reg Shape: ", X_reg.shape)
y_regression = data['DEP_DELAY']

# Train and evluate the sequential model
gb_classifier, gb_regressor, y_pred, y_reg_test, rs = train_sequential_model(X_class, X_reg, y_classification, y_regression)

print("Regression Predictions (DEP_DELAY):", y_pred[:5])
print("True Values (DEP_DELAY):", y_reg_test[:5])
print("R-squared value:", rs)

'''
////////////////////////////////////////////////////////////////////////////////////
                        Set up the X_class_input features
////////////////////////////////////////////////////////////////////////////////////
'''
X_class_input = pd.DataFrame({
    'DOT_CODE': [20304],
    'DISTANCE': [425],
    'Origin_DestPair': [1621],
    'crs_dep_military_time': [1745],
    'crs_arr_military_time': [1934],
    'airport_region_group_encoded': [2],
    'crs_dep_military_hour': [17]
})

'''
///////// Calculate route_delay_rank /////////
'''
# Group by Origin_DestPair and delayed_status. Calculate separate medians for each (-1, 0, 1)
grouped_data = data.groupby(['Origin_DestPair', 'Delayed_Status'])['route_delay_rank'].median().reset_index()
grouped_data = grouped_data.pivot(index='Origin_DestPair', columns='Delayed_Status', values='route_delay_rank').reset_index()
grouped_data.fillna(0.5, inplace=True)  # Default to neutral rank where no data exists

# Balance the contributions
grouped_data['balanced_route_delay_rank'] = (
    # grouped_data[-1] * 0.5 + grouped_data[0] * 0.25 + grouped_data[1] * 0.25
    grouped_data[-1] * 0.5 + grouped_data[0] * 0.25 + grouped_data[1] * 0.25
)

# Map the balances values
# X_class_input['Origin_DestPair'] = pd.Series(X_class_input['Origin_DestPair'])
X_class_input['route_delay_rank'] = X_class_input['Origin_DestPair'].map(
    grouped_data.set_index('Origin_DestPair')['balanced_route_delay_rank']
)

print("route_delay_rank: ", X_class_input['route_delay_rank'])

'''
///////// Calculate average_airline_delay /////////
'''
# X_class_input['DOT_CODE'] = pd.Series(X_class_input['DOT_CODE'])
X_class_input['average_airline_delay'] = X_class_input['DOT_CODE'].map(
    data.groupby('DOT_CODE')['average_airline_delay'].mean()
)

'''
///////// Calculate hourly_origin_dest_average /////////
'''
example_pair = X_class_input.loc[0, 'Origin_DestPair']
example_hour = X_class_input.loc[0, 'crs_dep_military_hour']

# Group historical data by 'Origin_DestPair' and 'crs_dep_military_hour'
hourly_grouped = data.groupby(['Origin_DestPair', 'crs_dep_military_hour', 'Delayed_Status'])['hourly_origin_dest_average'].median().reset_index()
hourly_grouped = hourly_grouped.pivot(index=['Origin_DestPair', 'crs_dep_military_hour'], columns='Delayed_Status', values='hourly_origin_dest_average').reset_index()
hourly_grouped.fillna(0.5, inplace=True)

# Balance the contributions
hourly_grouped['balanced_hourly_origin_dest_average'] = (
    hourly_grouped[-1] * 0.33 + hourly_grouped[0] * 0.33 + hourly_grouped[1] * 0.33
)

# Map the balances values
X_class_input['hourly_origin_dest_average'] = X_class_input.set_index(['Origin_DestPair', 'crs_dep_military_hour']
).index.map(hourly_grouped.set_index(['Origin_DestPair', 'crs_dep_military_hour'])['balanced_hourly_origin_dest_average'].to_dict()).fillna(0.5)


'''
////////////////////////////////////////////////////////////////////////////////////
                    Ending Set up the X_class_input features
////////////////////////////////////////////////////////////////////////////////////
'''

# Convert to DataFrame
X_class_input_df = pd.DataFrame(X_class_input)

# Predict Delayed_Status using the classification model
# y_class_pred = gb_classifier.predict(X_class_input_df)
y_class_pred = gb_classifier.predict(X_class_input)

print("Classification Prediction: ", y_class_pred)

# Add the classification output as an input for the regression
X_reg_input = X_class_input.copy()      # Make a copy of the original input
X_reg_input['Delayed_Status'] = y_class_pred    # Add the predicted Delayed_Status
X_reg_input['Time_DistancePair'] = 452625
X_reg_input['average_delay_flight_route'] = X_reg_input['Origin_DestPair'].map(
    data.groupby('Origin_DestPair')['average_delay_flight_route'].mean()
)

print("Columns in X_reg (training data):", X_reg.columns)
print("Columns in X_reg_input (input data):", X_reg_input.columns)

# print("Types in X_reg (training data): ", X_reg.dtypes)
# print("Types in X_reg_input (input data): ", X_reg_input.dtypes)

# Print the column names
print("X_reg_input Shape: ", X_reg_input.shape)

# Convert X_reg_input to DataFrame
X_reg_input_df = pd.DataFrame(X_reg_input)

# Predict DEP_DELAY using the regression model
# y_reg_pred = gb_regressor.predict(X_reg_input_df)
y_reg_pred = gb_regressor.predict(X_reg_input_df)

# Replace the first value of predictions with the single prediction
y_pred[0] = y_reg_pred

# Output the regression prediciton
print("Predicted DEP_DELAY: ", y_reg_pred)
print("Predicted R^2 Value: ", r2_score(y_reg_test, y_pred))

# Mean Absolute Error
mae = mean_absolute_error(y_reg_test, y_pred)
print(f"Mean Absolute Error (MAE): {mae:.4f}")

# Evaluate model performance with different feature sets
scores = cross_val_score(gb_regressor, y_reg_test, y_pred, cv=5)
print(f'Cross-validation scores: {scores}')

# End the timer
end_time = time.time()

# Calculate elapsed time
elapsed_time = end_time - start_time
print(f"Elapsed time: {elapsed_time:.2f} seconds")

print("Done")