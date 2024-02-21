import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

gdp_df = pd.read_excel('uploads/world_gdp.xlsx')
countries = gpd.read_file('map_data/countries.geojson').to_crs('ESRI:54030')
country_bounds = gpd.read_file('map_data/country_bounds.geojson').to_crs('ESRI:54030')

map_df = countries.merge(gdp_df, left_on='NAME', right_on='NAME', how='left')

fig, ax = plt.subplots(figsize=(15, 10))
map_df.plot(column='gdp_per_capita', ax=ax, legend=True, cmap='Greens', missing_kwds={'color': '#eeeeee', 'label': 'Missing values'})
country_bounds.plot(ax=ax, color='white', linewidth=0.5)

plt.axis('off')
plt.savefig('world_gdp_map.pdf', bbox_inches='tight')
plt.savefig('world_gdp_map.png', bbox_inches='tight')