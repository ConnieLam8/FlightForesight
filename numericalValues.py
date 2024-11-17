import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Function to map multiple columns to numerical values using Label Encoding
def map_columns_with_label_encoding(df, columns):
    le = LabelEncoder()
    for column in columns:
        df[f'{column}NUMERICAL'] = le.fit_transform(df[column])  # Apply label encoding
    return df

if __name__ == "__main__":
    input_csv = 'Desktop/CodeCleanup/data_no_decimals.csv'
    output_csv = 'Desktop/CodeCleanup/NUMERICAL_DATA.csv'

    df = pd.read_csv(input_csv)

    # List of columns to be factorized
    columns_to_map = ['AIRLINE', 'AIRLINE_DOT','AIRLINE_CODE','ORIGIN','ORIGIN_CITY','DEST','DEST_CITY','CANCELLATION_CODE']

    df = map_columns_with_label_encoding(df, columns_to_map)

    df.to_csv(output_csv, index=False)

    print(f"Updated CSV file with ID columns saved to {output_csv}")
