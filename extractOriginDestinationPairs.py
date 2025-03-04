import pandas as pd
from bs4 import BeautifulSoup

# Load your data
data = pd.read_csv('NUMERICAL_DATA_final_with_outliers_with_weather.csv')

# Extract the unique ORIGIN - OriginAirportID pairs
pairs = data[['ORIGIN', 'OriginAirportID']].drop_duplicates()

# Extract the unique DEST - DestAirportID pairs
dest_pairs = data[['DEST', 'DestAirportID']].drop_duplicates()

# Sort them in numerical order for ORIGIN
pairs = pairs.sort_values(by='OriginAirportID', ascending=True)

# Sort them in numerical order for DEST
dest_pairs = dest_pairs.sort_values(by='DestAirportID', ascending=True)

# Reset the pairs index's
pairs.reset_index(inplace=True)
dest_pairs.reset_index(inplace=True)

# Combine the two pairs
combine_pairs = pd.concat([pairs, dest_pairs], axis=1)

# Save results to a new CSV
combine_pairs.to_csv('OriginDestinationAirportPairs.csv', index=False)

# Save results to a destination CSV
# dest_pairs.to_csv('DestinationAirportPairs.csv', index=False)

'''
////////////////////////////////////////////////////////////////////////////////////
                    Split the values for the ORIGIN airports
////////////////////////////////////////////////////////////////////////////////////
'''

# Load the HTML file
with open('templates/airlineForm.html', 'r') as file:
    soup = BeautifulSoup(file, 'html.parser')

# Extract the origin option tags from the html file
selection = soup.find('select', {'id': 'ORIGIN', 'name': 'ORIGIN'})

if selection:
    options = selection.find_all('option')
    
# Load the correct csv file with the pairs
data_pairs = pd.read_csv('OriginDestinationAirportPairs.csv')

# Replace the mismatched values
csv_lookup = dict(zip(data_pairs['ORIGIN'], data_pairs['OriginAirportID']))

# Iterate through each option tag
for option in options:
    origin = option.text.strip()
    current_value = option['value']
    
    # Check if the ORIGIN value is the same from the one in the csv file
    if origin in csv_lookup:
        correct_value = str(csv_lookup[origin])
        if current_value != correct_value:
            print(f"Replacing value for {origin}: {current_value} -> {correct_value}")
            option['value'] = correct_value     # Replace with the correct value
            
# Save the updated html file
with open('templates/airlineForm.html', 'w') as file:
    file.write(str(soup))
    
'''
////////////////////////////////////////////////////////////////////////////////////
                    Split the values for the DEST airports
////////////////////////////////////////////////////////////////////////////////////
'''

# Load the HTML file
with open('templates/airlineForm.html', 'r') as file:
    soup = BeautifulSoup(file, 'html.parser')

# Extract the origin option tags from the html file
selection = soup.find('select', {'id': 'DEST', 'name': 'DEST'})

if selection:
    options = selection.find_all('option')
    
existing_origins = {option.text.strip() for option in options}  # Set of existing origins in the HTML
    
# Load the correct csv file with the pairs
data_pairs = pd.read_csv('OriginDestinationAirportPairs.csv')

# Replace the mismatched values
csv_lookup = dict(zip(data_pairs['DEST'], data_pairs['DestAirportID']))

# Iterate through each option tag
for option in options:
    origin = option.text.strip()
    current_value = option['value']
    
    # Check if the ORIGIN value is the same from the one in the csv file
    if origin in csv_lookup:
        correct_value = str(csv_lookup[origin])
        if current_value != correct_value:
            print(f"Replacing value for {origin}: {current_value} -> {correct_value}")
            option['value'] = correct_value     # Replace with the correct value

# Add missing option html values if not already in the HTML form
for origin, correct_value in csv_lookup.items():
    if origin not in existing_origins:
        new_option = soup.new_tag('option', value=correct_value)
        new_option.string = origin
        selection.append(new_option)  # Add the new option to the select tag
        print(f"Added new option for {origin}: {correct_value}")    

# Save the updated html file
with open('templates/airlineForm.html', 'w') as file:
    file.write(str(soup))
    
'''
////////////////////////////////////////////////////////////////////////////////////
            Find the corresponding ORIGIN - DEST Airport Pairs Value
////////////////////////////////////////////////////////////////////////////////////
'''
# Check the original excel file for the matching origin and destination airport id's to grab the Origin_DestPair

