import json

desired_categories = {
    "hotel",
    "art_museum",
    "aviation_museum",
    "children's_museum",
    "community_museum",
    "contemporary_art_museum",
    "costume_museum",
    "design_museum",
    "history_museum",
    "modern_art_museum",
    "museum",
    "science_museum",
    "sports_museum",
    "college_university",
    "park",
    "baptist_church",
    "catholic_church",
    "church_cathedral",
    "episcopal_church",
    "evangelical_church",
    "pentecostal_church",
    "sculpture_statue",
    "synagogue",
    "landmark_and_historical_building",
    "monument",
    "zoo"
}

with open('output.geojson', 'r') as f:
    data = json.load(f)

output_landmarks = {
    "type": "FeatureCollection",
    "features": []
}

for feature in data['features']:
    if feature['properties']['categories'] in desired_categories:
        # Simplify the names field to just the primary name
        if 'names' in feature['properties']:
            primary_name = feature['properties']['names'].get('primary', '')
            feature['properties']['names'] = primary_name
        output_landmarks['features'].append(feature)

with open('output_landmarks.geojson', 'w') as f:
    json.dump(output_landmarks, f)