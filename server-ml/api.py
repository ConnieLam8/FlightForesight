import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, render_template
from datetime import datetime
from flask import jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
print('Start')

# Load your data
# data = pd.read_csv('NUMERICAL_DATA_final_with_outliers_with_weather.csv')
data = ''

# Define the route for the main page with the form
@app.route('/')
def index():
    return render_template('airlineForm.html', reg_result=None)

def military_time_to_minutes(time_str):
    # Split the time string into hours and minutes
    time_str = time_str.astype(str)
    hours = time_str.str[:2].astype(int) 
    minutes = time_str.str[2:].astype(int) 

    # Convert to total minutes
    total_minutes = hours * 60 + minutes
    return total_minutes

# Prediction function for Classification
def MlModelClassificationPredictor(to_predict_list, model_type='classifier'):
    to_predict = np.array(to_predict_list).reshape(1, -1)

    # Load the ML Classification Model
    with open('model.pkl', 'rb') as file:
        models = pickle.load(file)

    # Access the classification model
    class_model = models.get(model_type)

    # Make model prediction
    result = class_model.predict(to_predict)

    return result[0]

# Prediction function for Regression
def MlModelRegressionPredictor(to_predict_list, model_type='regressor'):
    to_predict = np.array(to_predict_list).reshape(1, -1)

    # Load the ML Regression Model
    with open('model.pkl', 'rb') as file:
        models = pickle.load(file)

    # Access the regression model
    reg_model = models.get(model_type)

    # Make model prediction
    result = reg_model.predict(to_predict)

    return result[0]

@app.route('/result', methods = ['POST'])
def result():
    if request.method == 'POST':
        # Get the JSON input as an array of objects
        to_predict_list = request.get_json()

        # Initialize an empty dictionary to store the extracted values
        extracted_data = {}

        # Extract the key-value pairs from the array of objects
        for item in to_predict_list:
            for key, value in item.items():
                extracted_data[key] = value

        print("Extracted Data: ", extracted_data)

        '''
        ////////////////////////////////////////////////////////////////////////////////////
                        Set up the prediction features and compute them
        ////////////////////////////////////////////////////////////////////////////////////
        '''
        # Extract the DOT_CODE from the form
        dot_code_value = int(extracted_data.get('DOT_CODE'))

        # Extract origin and destination airport from the form, change to int format for comparison
        origin_value = int(extracted_data.get('ORIGIN'))
        dest_value = int(extracted_data.get('DEST'))

        X_class_input = pd.DataFrame({
            'DOT_CODE': [dot_code_value]
        })

        Extra_class_input = pd.DataFrame({
            'ORIGIN': [origin_value],
            'DEST': [dest_value]
        })

        print("X_class_input!!!!: ", X_class_input)

        '''
        ///////// Calculate the Origin_Dest Airport Pair Code /////////
        '''
        merged_df = Extra_class_input.merge(
            data[['OriginAirportID', 'DestAirportID', 'Origin_DestPair']],
            left_on=['ORIGIN', 'DEST'],
            right_on=['OriginAirportID', 'DestAirportID'],
            how='left'
        ).drop(columns=['OriginAirportID', 'DestAirportID'])

        print("merged_df: ", merged_df)

        # Update the X_class_input data frame
        X_class_input['Origin_DestPair'] = merged_df['Origin_DestPair']

        # Replace routes that do not exist in the historical data with a -1 value
        X_class_input['Origin_DestPair'].fillna(-1, inplace=True)

        print("Origin_DestPair: ", X_class_input['Origin_DestPair'])

        '''
        ///////// Fetch Distance from Data /////////
        '''
        X_class_input['DISTANCE'] = X_class_input['Origin_DestPair'].map(
            data.groupby(['Origin_DestPair'])['DISTANCE'].mean()
        )

        default_distance = 100  # Default value
        X_class_input['DISTANCE'] = X_class_input['DISTANCE'].fillna(default_distance)

        print("DISTANCE travelled: ", X_class_input['DISTANCE'])

        '''
        ///////// Get the times and the airport region group /////////
        '''
        dep_value = extracted_data.get('crs_dep_military_time')
        X_class_input['crs_dep_military_time'] = int(dep_value.replace(':', ''))

        arr_value = extracted_data.get('crs_arr_military_time')
        X_class_input['crs_arr_military_time'] = int(arr_value.replace(':', ''))

        # Get the airport_region_group_encoded
        X_class_input['airport_region_group_encoded'] = X_class_input['Origin_DestPair'].map(
            data.groupby(['Origin_DestPair'])['airport_region_group_encoded'].mean()
        )

        default_region = 0  # Default value
        X_class_input['airport_region_group_encoded'] = X_class_input['airport_region_group_encoded'].fillna(default_region)

        dep_hour_value = datetime.strptime(dep_value, '%H:%M')

        # Extract the hour
        hour_value = dep_hour_value.hour

        X_class_input['crs_dep_military_hour'] = int(hour_value)

        '''
        ///////// Calculate route_delay_rank /////////
        '''
        # Group by Origin_DestPair and delayed_status. Calculate separate medians for each (-1, 0, 1)
        grouped_data = data.groupby(['Origin_DestPair', 'Delayed_Status'])['route_delay_rank'].median().reset_index()
        grouped_data = grouped_data.pivot(index='Origin_DestPair', columns='Delayed_Status', values='route_delay_rank').reset_index()
        grouped_data.fillna(0.5, inplace=True)  # Default to neutral rank where no data exists

        # Balance the contributions
        grouped_data['balanced_route_delay_rank'] = (
                grouped_data[-1] * 0.333 + grouped_data[0] * 0.333 + grouped_data[1] * 0.333
        )

        # Map the balances values
        X_class_input['route_delay_rank'] = X_class_input['Origin_DestPair'].map(
            grouped_data.set_index('Origin_DestPair')['balanced_route_delay_rank']
        ).fillna(0.5)

        print("route_delay_rank: ", X_class_input['route_delay_rank'])

        '''
        ///////// Calculate average_airline_delay /////////
        '''
        X_class_input['average_airline_delay'] = X_class_input['DOT_CODE'].map(
            data.groupby('DOT_CODE')['average_airline_delay'].mean()
        )

        print('average_airline_delay: ', X_class_input['average_airline_delay'])

        '''
        ///////// Calculate hourly_origin_dest_average /////////
        '''
        example_pair = X_class_input.loc[0, 'Origin_DestPair']
        example_hour = X_class_input.loc[0, 'crs_dep_military_hour']

        # Group historical data by 'Origin_DestPair' and 'crs_dep_military_hour'
        hourly_grouped = data.groupby(['Origin_DestPair', 'crs_dep_military_hour', 'Delayed_Status'])['hourly_origin_dest_average'].median().reset_index()
        hourly_grouped = hourly_grouped.pivot(index=['Origin_DestPair', 'crs_dep_military_hour'], columns='Delayed_Status', values='hourly_origin_dest_average').reset_index()
        hourly_grouped.fillna(0.5, inplace=True)

        # Balance the contributions
        hourly_grouped['balanced_hourly_origin_dest_average'] = (
                hourly_grouped[-1] * 0.33 + hourly_grouped[0] * 0.0 + hourly_grouped[1] * 0.33
        )

        # Map the balances values
        X_class_input['hourly_origin_dest_average'] = X_class_input.set_index(['Origin_DestPair', 'crs_dep_military_hour']
                                                                              ).index.map(hourly_grouped.set_index(['Origin_DestPair', 'crs_dep_military_hour'])['balanced_hourly_origin_dest_average'].to_dict()).fillna(0.5)

        '''
        ///////// Calculate route_hour_delay_rank /////////
        '''
        hourly_grouped_2 = data.groupby(['Origin_DestPair', 'crs_dep_military_hour'])['route_hour_delay_rank']

        # Filter historical data to only the origin-destination-hour pair we're looking for
        filtered_historical_hourly_data_2 = hourly_grouped_2.get_group((example_pair, example_hour)) if (example_pair, example_hour) in hourly_grouped_2.groups else None
        print('filtered_historical_hourly_data_2: ', filtered_historical_hourly_data_2)

        if filtered_historical_hourly_data_2 is not None:
            median_hourly_route_2 = filtered_historical_hourly_data_2.median()
        else:
            # Default value if no data exists for the pair
            median_hourly_route_2 = 0.5

        X_class_input['route_hour_delay_rank'] = median_hourly_route_2

        print("////////////////////////////////////////////////////")
        print("X_class_input", X_class_input)

        '''
        ////////////////////////////////////////////////////////////////////////////////////
                                Predict the Classification Model
        ////////////////////////////////////////////////////////////////////////////////////
        '''
        to_predict_list = X_class_input.values.flatten()
        print("Prediction List Values!!!: ", to_predict_list)

        class_result = MlModelClassificationPredictor(to_predict_list)
        print("CLASSIFICATION RESULT: ", class_result)

        '''
        ////////////////////////////////////////////////////////////////////////////////////
                                Predict the Regression Model
        ////////////////////////////////////////////////////////////////////////////////////
        '''
        # Add the additional input values needed for the regression
        X_reg_input = X_class_input.copy()      # Make a copy of the original input
        print('X_reg_input: ', X_reg_input)
        X_reg_input['Delayed_Status'] = class_result    # Add the predicted Delayed_Status

        # Compute the CRS_DEP_TIME in minutes
        crs_dep_military_time_value = X_reg_input['crs_dep_military_time']
        print('crs_dep_military_time_value: ', crs_dep_military_time_value)
        dep_time_total_minutes = military_time_to_minutes(crs_dep_military_time_value)

        X_reg_input['Time_DistancePair'] = dep_time_total_minutes * X_reg_input['DISTANCE']
        X_reg_input['average_delay_flight_route'] = X_reg_input['Origin_DestPair'].map(
            data.groupby('Origin_DestPair')['average_delay_flight_route'].mean()
        )

        reg_predict_list = X_reg_input.values.flatten()
        reg_result = MlModelRegressionPredictor(reg_predict_list)
        print("REGRESSION RESULT: ", reg_result)

        return jsonify({
            'classification_result': int(class_result),  # Convert to int
            'regression_result': float(reg_result),        # Ensure it's a float if needed
            # Add other fields as necessary
        })

        # return render_template('airlineForm.html', class_result=class_result, reg_result=reg_result)

# Run the application
if __name__ == "__main__":
    app.run(debug=True)