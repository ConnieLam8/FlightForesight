#run a correlation matrix to see which features have the highest correlation to be able to be used for featuresX

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.read_csv("NUMERICAL_DATA_final_with_outliers_with_weather.csv")

featuresX = ["route_delay_rank", "route_delay_std", "hourly_origin_dest_average", "airport_region_group_encoded"]
# Select features and target variable
X = data[featuresX]
y = data["ARR_DELAY"]

# Combine X and y into a single DataFrame
selected_data = X.copy()
selected_data["ARR_DELAY"] = y

# Compute the correlation matrix for the selected features and the target variable
correlation_matrix = selected_data.corr()

# Print the correlation of features with the target variable
print(correlation_matrix["ARR_DELAY"].sort_values(ascending=False))

# Plot the correlation matrix
plt.figure(figsize=(6, 6))
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Correlation Matrix")
plt.show()
