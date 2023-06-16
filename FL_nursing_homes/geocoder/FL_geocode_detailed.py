import csv
import googlemaps

# Replace 'YOUR_API_KEY' with your actual Google Maps API key
API_KEY = 'TK'

# Create a Google Maps client
gmaps = googlemaps.Client(key=API_KEY)

# Define the input and output file paths
input_file = 'nursing_homes_to_geocode.csv'
output_file = 'nursing_geocode_detailed_results.csv'

# Open the input and output CSV files
with open(input_file, 'r') as csv_input, open(output_file, 'w', newline='') as csv_output:
    reader = csv.DictReader(csv_input)
    
    # Define the fieldnames for the output CSV
    fieldnames = ['nursing_home_label', 'city', 'county', 'state', 'latitude', 'longitude', 'location_type', 'partial_match']
    
    writer = csv.DictWriter(csv_output, fieldnames=fieldnames)
    writer.writeheader()
    
    # Process each row in the input CSV
    for row in reader:
        nursing_home_label = row['nursing_home_label']
        city = row['city']
        county = row['county']
        state = row['state']
        
        # Create the address string
        address = f"{nursing_home_label}, {city}, {county}, {state}"
        
        # Geocode the address
        geocode_result = gmaps.geocode(address)
        
        if geocode_result:
            # Extract the relevant information from the geocode result
            latitude = geocode_result[0]['geometry']['location']['lat']
            longitude = geocode_result[0]['geometry']['location']['lng']
            location_type = geocode_result[0]['geometry']['location_type']
            partial_match = geocode_result[0].get('partial_match', False)
        else:
            # If geocode result is empty, set the values to None
            latitude = None
            longitude = None
            location_type = None
            partial_match = None
        
        # Write the results to the output CSV
        writer.writerow({
            'nursing_home_label': nursing_home_label,
            'city': city,
            'county': county,
            'state': state,
            'latitude': latitude,
            'longitude': longitude,
            'location_type': location_type,
            'partial_match': partial_match
        })

print("Geocoding complete. Results saved to nursing_geocode_detailed_results.csv.")
