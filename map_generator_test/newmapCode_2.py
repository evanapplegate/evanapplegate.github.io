import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Read the world map and GDP data
world = gpd.read_file('map_data/countries.geojson').to_crs('ESRI:54030')
gdp_data = pd.read_excel('uploads/world_gdp.xlsx')

# Merge the world map with GDP data
world_gdp = world.merge(gdp_data, on='NAME', how='left')

# Set a color for countries with no GDP data
world_gdp['gdp_per_capita'] = world_gdp['gdp_per_capita'].fillna(0)
world_gdp.loc[world_gdp['gdp_per_capita'] == 0, 'color'] = '#eeeeee'

# Define a color scale
world_gdp['color'] = pd.cut(world_gdp['gdp_per_capita'], bins=10, labels=[plt.cm.Greens(i) for i in range(10)], include_lowest=True)

fig, ax = plt.subplots(1, 1, figsize=(15, 10))
world_gdp.plot(ax=ax, color=world_gdp['color'], linewidth=0)
world.boundary.plot(ax=ax, color='white', linewidth=0.5)

plt.axis('off')
plt.savefig('world_gdp_map.png', bbox_inches='tight')
plt.savefig('world_gdp_map.pdf', bbox_inches='tight')