import csv
import googlemaps

# Set your Google Maps API key
API_KEY = "AIzaSyBDC2g9RaCZMHp0-BRPMFjTjKy1QeLjscM"

# Load the CSV file with addresses
input_file = "assisted_living.csv"
output_file = "assisted_living_geocoded.csv"

# Initialize the Google Maps client
gmaps = googlemaps.Client(key=API_KEY)

# Geocode the addresses and write the results to a new CSV
with open(input_file, "r") as csv_file:
    csv_reader = csv.DictReader(csv_file)

    with open(output_file, "w", newline="") as output_csv:
        fieldnames = ["business_name", "city", "county", "state", "latitude", "longitude"]
        writer = csv.DictWriter(output_csv, fieldnames=fieldnames)
        writer.writeheader()

        for row in csv_reader:
            business_name = row["business_name"]
            city = row["city"]
            county = row["county"]
            state = row["state"]

            # Construct the address string
            address = f"{business_name}, {city}, {county}, {state}"

            # Geocode the address
            geocode_result = gmaps.geocode(address)

            # Extract latitude and longitude if the result is available
            if len(geocode_result) > 0:
                latitude = geocode_result[0]["geometry"]["location"]["lat"]
                longitude = geocode_result[0]["geometry"]["location"]["lng"]
            else:
                latitude = None
                longitude = None

            # Write the result to the output CSV
            writer.writerow({
                "business_name": business_name,
                "city": city,
                "county": county,
                "state": state,
                "latitude": latitude,
                "longitude": longitude
            })

print("Geocoding complete. Results saved to assisted_living_geocoded.csv.")
