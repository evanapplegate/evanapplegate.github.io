import json

print("Loading places.geojson...")
with open('places.geojson', 'r') as f:
    data = json.load(f)

output = {
    "type": "FeatureCollection",
    "features": []
}

print("Processing features...")
for feature in data['features']:
    try:
        main_category = feature['properties']['categories']['main']
        print(f"Extracted main category: {main_category}")
        feature['properties']['categories'] = main_category
        output['features'].append(feature)
    except KeyError:
        print("Skipping feature without 'categories' key or 'main' subkey.")

print("Writing to output.geojson...")
with open('output.geojson', 'w') as f:
    json.dump(output, f)
print("Done.")