import pandas as pd

# Function to remove decimal values from all columns if they exist
def remove_decimals(df):
    for column in df.columns:
        if pd.api.types.is_float_dtype(df[column]):
            df[column] = df[column].astype('Int64')
    return df

# Main function
if __name__ == "__main__":
    # File paths
    input_csv = 'Desktop/CodeCleanup/flights_update0.0.csv'
    output_csv = 'Desktop/CodeCleanup/data_no_decimals.csv'

    df = pd.read_csv(input_csv)

    df = remove_decimals(df)

    df.to_csv(output_csv, index=False)

    print(f"Updated CSV file with no decimal values saved to {output_csv}")
