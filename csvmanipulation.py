#Grab DEP_DELAY based on historical data as the user can't enter it as a featuresX 
import pandas as pd
from datetime import datetime

# Function to convert total minutes to HHMM format
def convert_to_time(total_minutes):
    hours = total_minutes // 60
    minutes = total_minutes % 60
    return f"{hours:02d}{minutes:02d}"  # Format as HHMM

# Function to convert HH:MM format to total minutes
def time_to_minutes(time_str):
    time_obj = datetime.strptime(time_str, '%H:%M')  # Parse HH:MM format
    return time_obj.hour * 60 + time_obj.minute  # Return total minutes

# Load your CSV file
df = pd.read_csv('NUMERICAL_DATA_copy.csv')

# User-provided CRS_ARR_TIME and CRC_DEP_TIME in HH:MM format
user_crs_arr_time_str = "22:45"  # Example input
user_crc_dep_time_str = "23:50"  # Example input

# Convert user input from HH:MM to total minutes
user_crs_arr_minutes = time_to_minutes(user_crs_arr_time_str)
user_crc_dep_minutes = time_to_minutes(user_crc_dep_time_str)

# Find rows where the times exactly match
matching_rows = df[
    (df['CRS_ARR_TIME'] == user_crs_arr_minutes) &
    (df['CRC_DEP_TIME'] == user_crc_dep_minutes)
]

# Convert matching times back to HHMM for output
if not matching_rows.empty:
    matching_rows['CRS_ARR_TIME'] = matching_rows['CRS_ARR_TIME'].apply(convert_to_time)
    matching_rows['CRC_DEP_TIME'] = matching_rows['CRC_DEP_TIME'].apply(convert_to_time)
    print(matching_rows[['CRS_ARR_TIME', 'CRC_DEP_TIME', 'DISTANCE', 'CRS_ELAPSED_TIME', 'DEP_DELAY']])
else:
    print("No matching rows found.")
