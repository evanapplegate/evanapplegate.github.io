from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas as pd
import time
import requests
import json
import os

# Define the path for the existing CSV file
csv_file_path = 'incidents.csv'

# Step 1: Set up the WebDriver
driver = webdriver.Chrome('/Users/good_mbp/Downloads/traffic_tester/lets_scrape/chromedriver')  # Replace with the correct path to your chromedriver

# Step 2: Open the page and wait for it to load
url = "https://udottraffic.utah.gov/list/events/traffic?start=0&length=100&filters%5B0%5D%5Bi%5D=1&filters%5B0%5D%5Bs%5D=Incidents&order%5Bi%5D=2&order%5Bdir%5D=asc"
driver.get(url)
time.sleep(10)  # Adjust the sleep time if necessary

# Step 3: Extract the data
table = driver.find_element(By.ID, 'eventTable')
rows = table.find_elements(By.TAG_NAME, 'tr')
data = []
for row in rows[1:]:  # Skip the header row
    cells = row.find_elements(By.TAG_NAME, 'td')
    if len(cells) > 1:  # Ensure it's a data row
        dataId = row.get_attribute('id')
        rowData = [dataId] + [cell.text for cell in cells[1:]]  # Exclude control cell
        data.append(rowData)

driver.quit()  # Close the WebDriver

# Define columns based on the data extracted
columns = ["dataId", "type", "route", "county", "location", "description", "startTime", "anticipatedEndTime", "lastUpdated", "extraColumn"]

# Convert to DataFrame
df = pd.DataFrame(data, columns=columns)

# Step 4: Fetch JSON data
json_url = "https://udottraffic.utah.gov/map/mapIcons/Incidents"
json_response = requests.get(json_url)
json_data = json.loads(json_response.content)

# Step 5: Process and add location data to DataFrame
locations = {item['itemId']: item['location'] for item in json_data['item2']}
df['latitude'] = df['dataId'].apply(lambda x: locations.get(x, [None, None])[0])
df['longitude'] = df['dataId'].apply(lambda x: locations.get(x, [None, None])[1])

# Load existing data if available and append new data
if os.path.exists(csv_file_path):
    existing_df = pd.read_csv(csv_file_path)
    updated_df = pd.concat([existing_df, df], ignore_index=True)
else:
    updated_df = df

# Drop duplicates based on 'dataId'
updated_df.drop_duplicates(subset='dataId', keep='last', inplace=True)

# Step 6: Save updated DataFrame to CSV
updated_df.to_csv(csv_file_path, index=False)