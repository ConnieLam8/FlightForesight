import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
from sklearn.utils.class_weight import compute_sample_weight
import time

# Start the timer
start_time = time.time()

# Load your data
data = pd.read_csv('NUMERICAL_DATA_final_new_features_with_weather_2019_adjacent.csv')

# Create the 'Delayed_Status' column based on 'DelayTime'
data['Delayed_Status'] = data['DEP_DELAY'].apply(lambda x: 1 if x < 0 else 0)

X = data[['DOT_CODE', 'FL_NUMBER',
             'DISTANCE', 'CRS_DEP_TIME', 'CRS_ARR_TIME', 'AIRLINE_DOTNUMERICAL', 'CRS_ELAPSED_TIME',
             'Origin_DestPair', 'Time_DistancePair',
             'crs_dep_hour', 'crs_dep_military_hour', 'crs_dep_military_time',
             'crs_arr_military_time', 'altimer_setting', 'dew_temperature_point', 'dry_temperature', 'relative_humidity',
             'visibility', 'feels_like_temperature', 'sea_level_pressure', 
             'precipiation', 'average_airline_delay', 'average_delay_flight_route']]
y = data['Delayed_Status']

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

sample_weights = compute_sample_weight(
    class_weight={-1: 1.7777777777777777, 0: 4, 1: 1}, 
    y=y_train
    )

# Initialize the Gradient Boosting Classifier
gb_classifier = GradientBoostingClassifier()

gb_classifier.fit(X_train, y_train)

# Predict on the test data
gb_predictions = gb_classifier.predict(X_test)

# Classification report
print("Gradient Boosting Classifier Report:")
print(classification_report(y_test, gb_predictions))

# Confusion matrix
print("Confusion Matrix:")
print(confusion_matrix(y_test, gb_predictions))

# Predict the model accuracy score
accuracy = gb_classifier.score(X_test, y_test)
print("Gradient Boosting Score: ", accuracy)

# End the timer
end_time = time.time()

# Calculate elapsed time
elapsed_time = end_time - start_time
print(f"Elapsed time: {elapsed_time:.2f} seconds")