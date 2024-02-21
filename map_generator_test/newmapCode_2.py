import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

map_data_path = 'map_data/'
data_path = 'uploads/world_gdp.xlsx'

gdp_data = pd.read_excel(data_path)
world = gpd.read_file(f'{map_data_path}countries.geojson').to_crs('ESRI:54030')
world_bounds = gpd.read_file(f'{map_data_path}country_bounds.geojson').to_crs('ESRI:54030')

world = world.merge(gdp_data, how='left', on='NAME')
world['gdp_per_capita'] = pd.to_numeric(world['gdp_per_capita'], errors='coerce')

fig, ax = plt.subplots(figsize=(15, 10))
world.plot(column='gdp_per_capita', cmap='Greens', linewidth=0, missing_kwds={'color': '#eeeeee'}, ax=ax)
world_bounds.plot(ax=ax, color='white', linewidth=0.5)

plt.axis('off')
plt.savefig('world_gdp_map.pdf', bbox_inches='tight')
plt.savefig('world_gdp_map.png', bbox_inches='tight')