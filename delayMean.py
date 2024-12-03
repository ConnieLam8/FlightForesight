#calculate the mean of DEP_DELAY per month as the user can't enter it for featuresX
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split, cross_val_score
import numpy as np

# Reading data
df = pd.read_csv("NUMERICAL_DATA_final 2.csv")

# Ensure the dataframe is sorted by the time column, in this case, CRS_ARR_TIME
df = df.sort_values('CRS_ARR_TIME')

# Extract Year and Month for grouping
df['Year'] = pd.to_datetime(df['CRS_ARR_TIME']).dt.year
df['Month'] = pd.to_datetime(df['CRS_ARR_TIME']).dt.month

# Calculate the monthly mean for DEP_DELAY
monthly_dep_delay_mean = df.groupby(['Year', 'Month'])['DEP_DELAY'].transform('mean')
df['DEP_DELAY_MONTHLY_MEAN'] = monthly_dep_delay_mean

# Defining features (using the new monthly mean feature for DEP_DELAY)
featuresX = ["Year", "Month", "DayofMonth", "OriginAirportID", "DestAirportID", "CRS_ARR_TIME", "CRS_DEP_TIME", "DEP_DELAY_MONTHLY_MEAN"]
X = df[featuresX]
y = df['DEP_DELAY']

# Train-test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Random forest regressor
rf = RandomForestRegressor(n_estimators=100, max_depth=5, min_samples_split=10, min_samples_leaf=5, random_state=42)
rf.fit(X_train, y_train)

# Predicting the DEP_DELAY values on the test set
y_pred = rf.predict(X_test)

# Calculating R² score to evaluate the model's performance
r2 = r2_score(y_test, y_pred)
print(f"R² Score: {r2}")

# Calculate Mean Absolute Error
mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Absolute Error (MAE): {mae}")

# Cross-validation scores
scores = cross_val_score(rf, X_train, y_train, cv=5)
print(f'Cross-validation scores: {scores}')

# Root Mean Squared Error (RMSE)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
print("RMSE: ", rmse)

# Hardcoded user inputs for prediction
print("\nHardcoded inputs to predict DEP_DELAY:")
year = 2023
month = 8
day_of_month = 6
origin_airport_id = 247
dest_airport_id = 325
crs_arr_time = 1829
crs_dep_time = 1608

# Get the monthly mean for the hardcoded input
dep_delay_monthly_mean = df[(df['Year'] == year) & (df['Month'] == month)]['DEP_DELAY_MONTHLY_MEAN'].mean()

# Prepare the input for prediction as a DataFrame
user_input = pd.DataFrame({
    "Year": [year],
    "Month": [month],
    "DayofMonth": [day_of_month],
    "OriginAirportID": [origin_airport_id],
    "DestAirportID": [dest_airport_id],
    "CRS_ARR_TIME": [crs_arr_time],
    "CRS_DEP_TIME": [crs_dep_time],
    "DEP_DELAY_MONTHLY_MEAN": [dep_delay_monthly_mean]
})

# Predicting DEP_DELAY for the hardcoded input
user_pred = rf.predict(user_input)
print(f"\nPredicted DEP_DELAY for the hardcoded input: {user_pred[0]}")
