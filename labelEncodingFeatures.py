import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn import preprocessing
from sklearn.cluster import KMeans
from scipy.stats import rankdata

# Load the data
df = pd.read_csv('NUMERICAL_DATA_final_new_features_with_weather_2019_adjacent.csv')

'''
//////// Create the origin-destination column and time-distance column ////////
'''
# Make a new column for the Origin-Destination Pair of Airports
df['Origin_DestPair'] = df['OriginAirportID'].astype(str) + '_' + df['DestAirportID'].astype(str)

# Change the type (str) of the Origin-DestPair to a numerical value with label encoding
encodeOriginDest = preprocessing.LabelEncoder()

# Encode the labels in the Origin-DestPair column
df['Origin_DestPair'] = encodeOriginDest.fit_transform(df['Origin_DestPair'])

# Make a new column for Time-Distance Interaction
df['Time_DistancePair'] = df['DISTANCE'] * df['CRS_DEP_TIME']

'''
//////// Label Encode Airport Region Groups ////////
'''

# Label encode the airpot region groups
label_encoder = LabelEncoder()
df['airport_region_group_encoded'] = label_encoder.fit_transform(df['airport_region_group'])

'''
//////// Calculate Average Airline Delays ////////
'''
# Group by 'DOT_CODE' (assuming it's the airline code) and calculate the average departure delay
average_delay_per_airline = df.groupby('DOT_CODE')['DEP_DELAY'].mean().reset_index()

# Rename the 'DEP_DELAY' column to 'average_airline_delay' for the grouped data (but not in the original df)
average_delay_per_airline.rename(columns={'DEP_DELAY': 'average_airline_delay'}, inplace=True)

# Merge the average delay back into the original dataframe on the 'DOT_CODE'
df = pd.merge(df, average_delay_per_airline[['DOT_CODE', 'average_airline_delay']], on='DOT_CODE', how='left')

'''
//////// Create the Average Delay for Flight Route ////////
'''
# Calculate the average delay for each route
average_delay_per_route = df.groupby('Origin_DestPair')['DEP_DELAY'].mean().reset_index()

# Rename the 'DEP_DELAY' column to 'average_delay_flight_route'
average_delay_per_route.rename(columns={'DEP_DELAY': 'average_delay_flight_route'}, inplace=True)

# Merge the average delay for each route back into the original dataframe
df = pd.merge(df, average_delay_per_route[['Origin_DestPair', 'average_delay_flight_route']], on='Origin_DestPair', how='left')

'''
//////// Create the bad weather column ////////
'''
# Define bad weather parameters
bad_weather = (
    (df['visibility'] < 1) |
    (df['precipiation'] > 0.2) |
    (df['wind_speed'] > 20) 
)

# Create a new column 'bad_weather_indicator'
df['bad_weather_indicator'] = bad_weather.astype(int)

'''
//////// Create a normalized departure delay column ////////
'''
df['normalized_dep_delay'] = df['DEP_DELAY'] - df['average_delay_flight_route']

'''
//////// Cluster Routers by Delay Patterns ////////
'''
# Compute route-level delay statistics
route_stats = df.groupby('Origin_DestPair')['DEP_DELAY'].agg(['mean', 'std']).fillna(0)

# Apply K-Means clustering
kmeans = KMeans(n_clusters=3, random_state=42)
route_stats['cluster'] = kmeans.fit_predict(route_stats[['mean', 'std']])

# Map cluster labels back to the main DataFrame
df['route_cluster'] = df['Origin_DestPair'].map(route_stats['cluster'])

'''
//////// Create a column for the route-time interaction ////////
'''
df['route_hour'] = df['Origin_DestPair'].astype(str) + '-' + df['crs_dep_military_hour'].astype(str)
average_route_hour_delay = df.groupby('route_hour')['DEP_DELAY'].mean()
df['avg_route_hour_delay'] = df['route_hour'].map(average_route_hour_delay)

'''
//////// Use Percentile Ranks of Route Delays ////////
'''
route_ranks = df.groupby('Origin_DestPair')['DEP_DELAY'].transform(lambda x: rankdata(x, method='average') / len(x))
df['route_delay_rank'] = route_ranks

'''
//////// Add Route Delay Variability as a Feature ////////
'''
route_stats = df.groupby('Origin_DestPair')['DEP_DELAY'].agg(['mean', 'std', 'median', 'quantile']).fillna(0)
df['route_delay_std'] = df['Origin_DestPair'].map(route_stats['std'])

'''
//////// Use Rolling Averages for Dynamic Trends ////////
'''
df = df.sort_values(by=['Origin_DestPair', 'FL_DATE'])  # Ensure sorting by route and time
df['rolling_avg_delay'] = df.groupby('Origin_DestPair')['DEP_DELAY'].rolling(window=7).mean().reset_index(0, drop=True)

'''
//////// Calculate the hourly route delay pattern ////////
'''
# hourly_delay = df.groupby(['Origin_DestPair', 'crs_dep_military_hour'])['route_delay_rank'].mean()
df['hourly_origin_dest_average'] = df.groupby(['Origin_DestPair', 'crs_dep_military_hour'])['route_delay_rank'].transform('mean')
df['route_hour_delay_rank'] = df.groupby(['Origin_DestPair', 'crs_dep_military_hour'])['DEP_DELAY'].rank(pct=True)

# Save the filtered dataFrame
df.to_csv('NUMERICAL_DATA_final_new_features_with_weather_2019_adjacent.csv', index=False)

print('Done')