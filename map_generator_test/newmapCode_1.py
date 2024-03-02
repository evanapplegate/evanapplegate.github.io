import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Load map data
countries = gpd.read_file('map_data/countries.geojson')
borders = gpd.read_file('map_data/country_bounds.geojson')

# Load GDP data
gdp_data = pd.read_excel('uploads/world_gdp.xlsx')

# Merge GDP data with country polygons
countries = countries.merge(gdp_data, on='NAME', how='left')

# Define colors for GDP per capita
cmap = 'Greens'
nan_color = '#eeeeee'

# Define bins for GDP per capita classification
class_bins = pd.qcut(countries['gdp_per_capita'].dropna(), 5, duplicates='drop')

# Create map
fig, ax = plt.subplots(1, 1, figsize=(15, 10))
countries.to_crs('ESRI:54030').plot(column='gdp_per_capita', cmap=cmap, legend=True, legend_kwds={'title': '2022 GDP per capita', 'bbox_to_anchor': (1, 1)}, scheme='quantiles', k=5, ax=ax, missing_kwds={'color': nan_color, 'label': 'No data'})
borders.to_crs('ESRI:54030').plot(ax=ax, color='white', linewidth=0.5)

# Remove axis
ax.axis('off')

# Save map
plt.savefig('world_gdp_map.pdf', bbox_inches='tight')
plt.savefig('world_gdp_map.png', bbox_inches='tight')