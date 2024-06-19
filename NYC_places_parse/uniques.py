import json

with open('output.geojson', 'r') as f:
    data = json.load(f)

unique_categories = set()
for feature in data['features']:
    unique_categories.add(feature['properties']['categories'])

with open('uniques.txt', 'w') as f:
    for category in unique_categories:
        f.write(f"{category}\n")
