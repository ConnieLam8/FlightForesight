# basic random forest code 
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

# Load your dataset (replace with your actual dataset)
data = pd.read_csv("NUMERICAL_DATA_copy.csv")

# Load featuresX from the dataset (assuming you are dynamically adding ARR_DELAY)
featuresX = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID", 
             "CRS_ARR_TIME", "CRS_DEP_TIME", "DISTANCE", "CRS_ELAPSED_TIME"]

# User input for prediction
user_input = {
    "Year": 2022,
    "Month": 7,
    "DayofMonth": 22,
    "OriginAirportID": 99,  # Replace with actual ID
    "DestAirportID": 247,   # Replace with actual ID
    "CRS_ARR_TIME": 1945,   # Scheduled arrival time in minutes
    "CRS_DEP_TIME": 1010,   # Scheduled departure time in minutes
    "DISTANCE": 1020,       # Example distance in miles
    "CRS_ELAPSED_TIME": 118 # Example elapsed time in minutes
}

# Step 1: Fetch the ARR_DELAY dynamically based on user input
def fetch_arr_delay_for_input(user_input, data, tolerance=100):
    matched_row = data[
        (data['CRS_DEP_TIME'].between(user_input['CRS_DEP_TIME'] - tolerance, user_input['CRS_DEP_TIME'] + tolerance)) &
        (data['CRS_ARR_TIME'].between(user_input['CRS_ARR_TIME'] - tolerance, user_input['CRS_ARR_TIME'] + tolerance))
    ]
    if not matched_row.empty:
        return matched_row.iloc[0]['ARR_DELAY']  # Return the first match
    return None

# Get the ARR_DELAY for the user input
arr_delay = fetch_arr_delay_for_input(user_input, data)

# If ARR_DELAY is found, add it to featuresX
if arr_delay is not None:
    featuresX.append('ARR_DELAY')
    # Add ARR_DELAY to the user input dictionary for prediction
    user_input["ARR_DELAY"] = arr_delay
else:
    print("No matching ARR_DELAY found for the given input.")

# Select features and target variable
X = data[featuresX].copy()
y = data["DEP_DELAY"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Apply Standard Scaler
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train the Random Forest Regressor
regressor = RandomForestRegressor(random_state=0, n_estimators=100)
regressor.fit(X_train, y_train)

# Evaluate the model
predictions = regressor.predict(X_test)
r2 = r2_score(y_test, predictions)
print(f'R-squared: {r2}')

# Print the user input with the added ARR_DELAY (if found)
print("User input with ARR_DELAY:", user_input)
