import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Load GeoJSON
countries = gpd.read_file('map_data/countries.geojson')
country_bounds = gpd.read_file('map_data/country_bounds.geojson')

# Load GDP data
gdp_data = pd.read_excel('uploads/world_gdp.xlsx')

# Merge the GDP data with the countries GeoDataFrame
countries = countries.merge(gdp_data, on='NAME', how='left')

# Set NaN gdp_per_capita values to a specific color
countries['gdp_per_capita'] = countries['gdp_per_capita'].fillna(value=-1)  # Using -1 as a placeholder for NaN values

# Plot
fig, ax = plt.subplots(figsize=(15, 10))
countries.to_crs('ESRI:54030').plot(ax=ax, column='gdp_per_capita', cmap='Greens', legend=True, missing_kwds={'color': '#eeeeee', 'label': 'Missing values'}, linewidth=0)

# Country borders
country_bounds.to_crs('ESRI:54030').plot(ax=ax, color='white', linewidth=0.5)

plt.axis('off')
plt.legend(title='GDP per Capita')

# Saving the figures
plt.savefig('world_gdp_map.pdf', bbox_inches='tight')
plt.savefig('world_gdp_map.png', bbox_inches='tight')