import pandas as pd

# Function to remove rows with empty or Null values in specified columns
def remove_null_columns_rows(input_csv, output_csv, columns_to_check):
    df = pd.read_csv(input_csv)
    
    df_cleaned = df.dropna(subset=columns_to_check)

    df_cleaned.to_csv(output_csv, index=False)

    print(f"Rows with empty or Null values in {columns_to_check} removed. Cleaned data saved to {output_csv}.")

# Main script
if __name__ == "__main__":
    input_csv = 'Desktop/CodeCleanup/flights_with_idsFinal.csv'
    output_csv = 'Desktop/CodeCleanup/flights_cleaned.csv'

    columns_to_check = ['FL_DATE', 'AIRLINE', 'AIRLINE_DOT','AIRLINE_CODE','DOT_CODE','FL_NUMBER','ORIGIN','ORIGIN_CITY','DEST','DEST_CITY','CRS_DEP_TIME','CRS_ARR_TIME','CANCELLED','CRS_ELAPSED_TIME','DISTANCE','Year','Month','DayofMonth','OriginAirportID','DestAirportID']  # Example: check for multiple columns
    remove_null_columns_rows(input_csv, output_csv, columns_to_check)
