import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Load data
countries_gdf = gpd.read_file('map_data/countries.geojson').to_crs('ESRI:54030')
gdp_df = pd.read_excel('uploads/world_gdp.xlsx')

# Merge GeoDataFrame with GDP data
merged_gdf = countries_gdf.merge(gdp_df, on='NAME', how='left')

# Create the figure and axis
fig, ax = plt.subplots(figsize=(15, 10))

# Plot countries
merged_gdf.plot(column='gdp_per_capita', ax=ax, legend=True, cmap='Greens', missing_kwds={'color': '#eeeeee'}, legend_kwds={'label': "GDP per Capita"})

# Plot borders
merged_gdf.boundary.plot(ax=ax, color='white', linewidth=0.5)

# Final touches and save
plt.axis('off')
plt.savefig('world_gdp_map.pdf', bbox_inches='tight')
plt.savefig('world_gdp_map.png', bbox_inches='tight')