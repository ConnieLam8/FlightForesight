import pandas as pd

# this code splits the dates
df = pd.read_csv('Desktop/flights_sample_3m.csv')

df['Year'] = pd.to_datetime(df['FlightDate']).dt.year
df['Month'] = pd.to_datetime(df['FlightDate']).dt.month
df['DayofMonth'] = pd.to_datetime(df['FlightDate']).dt.day


df.to_csv('updated_file.csv', index=False)

print("CSV file updated with 'Year', 'Month', and 'DayofMonth' columns.")
