import pandas as pd

# Function to update empty or Null values in a specific column to "0.0"
def update_null_values(input_csv, output_csv, column_to_check):
    df = pd.read_csv(input_csv)
    
    df[column_to_check] = df[column_to_check].fillna('0.0')

    df.to_csv(output_csv, index=False)

    print(f"Empty or Null values in column '{column_to_check}' updated to '0.0'. Updated data saved to {output_csv}.")

if __name__ == "__main__":
    input_csv = 'Desktop/CodeCleanup/flights_cleaned.csv'
    output_csv = 'Desktop/CodeCleanup/flights_cleaned2.csv'

    column_to_check = 'DEP_TIME'  # Replace with the name of the specific column you want to check

    update_null_values(input_csv, output_csv, column_to_check)
