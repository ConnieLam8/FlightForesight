import pandas as pd
import os
import time

# Start the timer
start_time = time.time()

# Load your data
df = pd.read_csv('data_weather_test.csv')

# Change the FL_DATE column to a datetime format
df['FL_DATE'] = pd.to_datetime(df['FL_DATE'])

# Grab the flight date that I'm looking for without dashes
format_date = df['FL_DATE'].dt.strftime('%Y%m%d').tolist()

# Create a dictionary for fast lookup (key = (airport, hour, mintue))
lookup_dict = {}

# Build the dictionary from your dataframe for faster matching
for i, row in df.iterrows():
    # Generate a key using airport, hour, and minute
    # key = (row['ORIGIN'], row['crs_dep_hour'], 00)  # assuming crs_dep_minute is always 0
    key = (row['ORIGIN'], row['crs_dep_hour'])  # assuming crs_dep_minute is always 0
    lookup_dict[key] = i  # Save the index of the row for fast lookup

# Read my the weather folder and look for the matching txt file
directory = os.getcwd()

# Loop through all folders and files in the directory
for dirpath, dirnames, filenames in os.walk(directory):
    for filename in filenames:
        if filename.endswith('.txt'):
            # Get the file name without the .txt
            fileNameNoTxt = os.path.splitext(filename)[0]

            # Check if the file is a .txt file and matches your condition
            if fileNameNoTxt in format_date:
                # Get the full path of the file
                file_path = os.path.join(dirpath, filename)
                print("File Path: ", file_path)
                
                # Open and read the file
                with open(file_path, 'r') as file:
                    content = file.readlines()[6:]      # Skip the first 6 lines in the txt file
                    print(f"Content of {filename}:")
                    
                    '''
                    /////////Add in the Weather Data//////////
                    '''

                    # Iterate through the lines and grab the correct column
                    for line in content:
                        # Split the lines by commas
                        columns = line.strip().split(',')

                        # Check if the line has enough columns
                        if len(columns) >= 30:
                            content_time = columns[1]    # Grab column 2

                            # Split the txt time into hours and minutes
                            date_part, time_part = content_time.split(" ")  # Split into '2019-01-01' and '00:00'
                            hours, minutes = map(int, time_part.split(":"))

                            # Get the departure airport
                            dep_airport = columns[0]    # Grab column 1

                            # Extract weather data from the .txt file
                            alti = columns[10]      # Column 11
                            dwpf = columns[5]       # Column 6
                            tmpf = columns[4]       # Column 5
                            relh = columns[6]       # Column 7
                            vsby = columns[12]      # Column 13
                            sknt = columns[8]       # Column 9
                            feel = columns[29]      # Column 30
                            mslp = columns[11]      # Column 12
                            p01i = columns[9]       # Column 10

                            # Create the key for fast lookup in the dictionary
                            # key = (dep_airport, hours, minutes)
                            key = (dep_airport, hours)

                            # If the key exists in the dictionary, update the row in df
                            if key in lookup_dict:
                                i = lookup_dict[key]
                                # Update the corresponding row in df
                                df.at[i, 'altimer_setting'] = alti
                                df.at[i, 'dew_temperature_point'] = dwpf
                                df.at[i, 'dry_temperature'] = tmpf
                                df.at[i, 'relative_humidity'] = relh
                                df.at[i, 'visibility'] = vsby
                                df.at[i, 'wind_speed'] = sknt
                                df.at[i, 'feels_like_temperature'] = feel
                                df.at[i, 'sea_level_pressure'] = mslp
                                df.at[i, 'precipiation'] = p01i
                                
                                print(f"Updated weather data for {dep_airport} at {hours}:{minutes}")
                        else:
                            print(f"Skipping line due to insufficient columns: {line}")

# Save the updated DataFrame to a new csv file
df.to_csv('data_weather_test.csv', index=False)

# End the timer
end_time = time.time()

# Calculate elapsed time
elapsed_time = end_time - start_time
print(f"Elapsed time: {elapsed_time:.2f} seconds")

print('Done')