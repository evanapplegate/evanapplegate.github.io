import pandas as pd

# Load the CSV files with a specified encoding and low_memory option
try:
    accidents = pd.read_csv('accident.csv', encoding='utf-8', low_memory=False)
except UnicodeDecodeError:
    accidents = pd.read_csv('accident.csv', encoding='latin-1', low_memory=False)

try:
    vehicles = pd.read_csv('vehicle.csv', encoding='utf-8', low_memory=False)
except UnicodeDecodeError:
    vehicles = pd.read_csv('vehicle.csv', encoding='latin-1', low_memory=False)

# Select the required columns from each file
accidents = accidents[['ST_CASE', 'STATENAME', 'LATITUDE', 'LONGITUD', 'FATALS']]
vehicles = vehicles[['ST_CASE', 'V_CONFIGNAME']]

# Merge the dataframes on 'ST_CASE'
combined = pd.merge(accidents, vehicles, on='ST_CASE', how='inner')

# Save the combined dataframe to a new CSV file
combined.to_csv('combined.csv', index=False)
