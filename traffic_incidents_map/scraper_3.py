from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import pandas as pd
import time
import requests
import json
import os

# Chrome options for headless execution
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(executable_path='/usr/local/bin/chromedriver', options=chrome_options)

url = "https://udottraffic.utah.gov/list/events/traffic?start=0&length=100&filters%5B0%5D%5Bi%5D=1&filters%5B0%5D%5Bs%5D=Incidents&order%5Bi%5D=2&order%5Bdir%5D=asc"
driver.get(url)
time.sleep(10)

table = driver.find_element(By.ID, 'eventTable')
rows = table.find_elements(By.TAG_NAME, 'tr')
data = []

for row in rows[1:]:
    cells = row.find_elements(By.TAG_NAME, 'td')
    if len(cells) > 1:
        dataId = row.get_attribute('id')
        rowData = [dataId] + [cell.text for cell in cells[1:]]
        data.append(rowData)

driver.quit()

columns = ["dataId", "type", "route", "county", "location", "description", "startTime", "anticipatedEndTime", "lastUpdated", "extraColumn"]
df = pd.DataFrame(data, columns=columns)

json_url = "https://udottraffic.utah.gov/map/mapIcons/Incidents"
json_response = requests.get(json_url)
json_data = json.loads(json_response.content)

locations = {item['itemId']: item['location'] for item in json_data['item2']}
df['latitude'] = df['dataId'].apply(lambda x: locations.get(x, [None, None])[0])
df['longitude'] = df['dataId'].apply(lambda x: locations.get(x, [None, None])[1])

csv_file_path = 'incidents.csv'

if os.path.exists(csv_file_path):
    existing_df = pd.read_csv(csv_file_path)
    updated_df = pd.concat([existing_df, df], ignore_index=True)
else:
    updated_df = df

updated_df.drop_duplicates(subset='dataId', keep='last', inplace=True)
updated_df.to_csv(csv_file_path, index=False)
