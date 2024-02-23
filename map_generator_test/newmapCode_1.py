import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Load country shapes and country boundaries
world = gpd.read_file('map_data/countries.geojson').to_crs('ESRI:54030')
world_bounds = gpd.read_file('map_data/country_bounds.geojson').to_crs('ESRI:54030')

# Load GDP data
gdp_data = pd.read_excel('uploads/world_gdp.xlsx')

# Merge GDP data with world geometries
world = world.merge(gdp_data, how='left', on='NAME')

# Set color for countries without GDP data
world['gdp_per_capita'] = world['gdp_per_capita'].fillna(-1)  # Temp value for coloring
na_color = '#eeeeee'
cmap = 'Greens'
norm = plt.Normalize(vmin=world[world['gdp_per_capita'] != -1]['gdp_per_capita'].min(), vmax=world['gdp_per_capita'].max())

fig, ax = plt.subplots(1, 1, figsize=(15, 10))
world.plot(column='gdp_per_capita', cmap=cmap, norm=norm, linewidth=0, ax=ax, missing_kwds={'color': na_color})
world_bounds.plot(ax=ax, color='white', linewidth=0.5)

sm = plt.cm.ScalarMappable(cmap=cmap, norm=norm)
sm.set_array([])
cbar = fig.colorbar(sm, ax=ax)
cbar.set_label('GDP per Capita')

plt.axis('off')
plt.savefig('world_gdp_per_capita_map.png', bbox_inches='tight')
plt.savefig('world_gdp_per_capita_map.pdf', bbox_inches='tight')