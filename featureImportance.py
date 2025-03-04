import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the data
df = pd.read_csv('NUMERICAL_DATA_final_new_features_with_weather_2019_adjacent.csv')

# Check the correlation heat map
# Specify the columns you want to correlate
columns_to_correlate = ['average_airline_delay', 'Delayed_Status', 'DEP_DELAY', 'crs_dep_hour', 'airport_region_group_encoded', 'crs_dep_military_hour', 'crs_arr_military_hour', 'crs_dep_military_time',
                        'crs_arr_military_time', 'altimer_setting', 'dew_temperature_point', 'dry_temperature', 'relative_humidity',
                        'visibility', 'wind_speed', 'feels_like_temperature', 'sea_level_pressure',
                        'precipiation', 'wind_direction', 'Origin_DestPair', 'Time_DistancePair', 'DOT_CODE']

X = df[['OriginAirportID', 'DestAirportID', 'Year', 'Month', 'DayofMonth', 'DOT_CODE', 'FL_NUMBER', 
             'DISTANCE', 'CRS_DEP_TIME', 'CRS_ARR_TIME', 'AIRLINE_DOTNUMERICAL', 'CRS_ELAPSED_TIME',
             'Origin_DestPair', 'Time_DistancePair',
             'crs_dep_hour', 'airport_region_group_encoded', 'crs_dep_military_hour', 'crs_arr_military_hour', 'crs_dep_military_time',
             'crs_arr_military_time', 'altimer_setting', 'dew_temperature_point', 'dry_temperature', 'relative_humidity',
             'visibility', 'wind_speed', 'feels_like_temperature', 'sea_level_pressure',
             'precipiation', 'wind_direction']]

# Compute the correlation matrix for the specified columns
correlation_matrix = df[columns_to_correlate].corr()

# Print the correlation of features with the target variable
print(correlation_matrix['Delayed_Status'].sort_values(ascending=False))  # Assuming 'DEP_DELAY' is your target

# Plot the heatmap for the specified columns
plt.figure(figsize=(8, 8))  # Adjust size for fewer columns
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Heatmap of Selected Features')
plt.show()