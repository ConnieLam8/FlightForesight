# basic code to try out random forest machine learning model with feature engineering
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

# Load your dataset (replace with your actual dataset)
data = pd.read_csv("NUMERICAL_DATA_copy.csv")

# FeaturesX to keep
featuresX = ["Year", "Month", "CRS_ARR_TIME", "CRS_DEP_TIME", 
             "DISTANCE", "CRS_ELAPSED_TIME", "DEP_DELAY"]

# Select features and target variable
X = data[featuresX].copy()
y = data["ARR_DELAY"]

# Ensure CRS_DEP_TIME and CRS_ARR_TIME are strings and pad with zeros
X['CRS_DEP_TIME'] = X['CRS_DEP_TIME'].astype(str).str.zfill(4)
X['CRS_ARR_TIME'] = X['CRS_ARR_TIME'].astype(str).str.zfill(4)

# Convert to datetime safely, marking invalid entries as NaT
X['CRS_DEP_TIME'] = pd.to_datetime(X['CRS_DEP_TIME'], format='%H%M', errors='coerce')
X['CRS_ARR_TIME'] = pd.to_datetime(X['CRS_ARR_TIME'], format='%H%M', errors='coerce')

# Drop rows with invalid time data and update y accordingly
valid_indices = X.dropna(subset=['CRS_DEP_TIME', 'CRS_ARR_TIME']).index
X = X.loc[valid_indices]
y = y.loc[valid_indices]

# Convert CRS_DEP_TIME and CRS_ARR_TIME to numeric hours
X['CRS_DEP_HOUR'] = X['CRS_DEP_TIME'].dt.hour
X['CRS_ARR_HOUR'] = X['CRS_ARR_TIME'].dt.hour

# Drop datetime columns as they are now represented numerically
X = X.drop(columns=['CRS_DEP_TIME', 'CRS_ARR_TIME'])

# Extract time-of-day bins
def time_of_day(hour):
    if 5 <= hour < 10:
        return 0  # Morning
    elif 10 <= hour < 16:
        return 1  # Midday
    elif 16 <= hour < 21:
        return 2  # Evening
    else:
        return 3  # Night

X['DEP_TIME_BIN'] = X['CRS_DEP_HOUR'].apply(time_of_day)
X['ARR_TIME_BIN'] = X['CRS_ARR_HOUR'].apply(time_of_day)

# Add interaction features
X['DistanceElapsedRatio'] = X['DISTANCE'] / X['CRS_ELAPSED_TIME']
X['DepTimeDistance'] = X['CRS_DEP_HOUR'] * X['DISTANCE']

# Normalize continuous features
scaler = StandardScaler()
X[['DISTANCE', 'CRS_ELAPSED_TIME', 'CRS_DEP_HOUR', 'CRS_ARR_HOUR']] = scaler.fit_transform(
    X[['DISTANCE', 'CRS_ELAPSED_TIME', 'CRS_DEP_HOUR', 'CRS_ARR_HOUR']]
)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the initial model
regressor = RandomForestRegressor(n_estimators=100, random_state=0, oob_score=True)
regressor.fit(X_train, y_train)

# Evaluate the model
predictions = regressor.predict(X_test)
r2 = r2_score(y_test, predictions)
print(f'Initial R-squared: {r2}')

# Feature importance
feature_importance = pd.Series(regressor.feature_importances_, index=X.columns).sort_values(ascending=False)
print("Feature Importance:\n", feature_importance)

# Hyperparameter tuning using GridSearchCV
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5, 10]
}
grid_search = GridSearchCV(RandomForestRegressor(random_state=0), param_grid, cv=3, scoring='r2')
grid_search.fit(X_train, y_train)

# Best parameters from grid search
print("Best parameters:", grid_search.best_params_)

# Evaluate the tuned model
best_model = grid_search.best_estimator_
tuned_predictions = best_model.predict(X_test)
tuned_r2 = r2_score(y_test, tuned_predictions)
print(f'Tuned R-squared: {tuned_r2}')
