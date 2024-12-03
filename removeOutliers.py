import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the data
df = pd.read_csv('NUMERICAL_DATA_final.csv')

sns.boxplot(data=df['DEP_DELAY'])
plt.title("Boxplot of Your Column")
print(plt.show())

# Identify the outliers that are outside of the Q1 and Q3 range
Q1 = df['DEP_DELAY'].quantile(0.25)
Q3 = df['DEP_DELAY'].quantile(0.75)
IQR = Q3 - Q1

# Defining the outlier bounds
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# Count the number of values above the upper bound
outliers_above_upper = df[df['DEP_DELAY'] > upper_bound]

# Print the number of outliers above the upper bound
print(f"Number of outliers above the upper bound: {outliers_above_upper.shape[0]}")

# Filtering out the outliers
df_no_outliers = df[(df['DEP_DELAY'] >= lower_bound) & (df['DEP_DELAY'] <= upper_bound)]
print("--Outliers--")
print(df_no_outliers)

# Save the new data filtered for no outliers into an excel file
df_no_outliers.to_csv('NUMERICAL_DATA_final_Removed_Outliers.csv', index=False)