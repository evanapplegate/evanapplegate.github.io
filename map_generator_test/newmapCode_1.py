import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

countries = gpd.read_file('map_data/countries.geojson').to_crs('ESRI:54030')
borders = gpd.read_file('map_data/country_bounds.geojson').to_crs('ESRI:54030')

gdp_data = pd.read_excel('uploads/world_gdp.xlsx')
countries = countries.merge(gdp_data, on='NAME', how='left')

fig, ax = plt.subplots(figsize=(15, 10))
countries.plot(column='gdp_per_capita', scheme='Quantiles', k=5, cmap='Greens', ax=ax, legend=True,
               missing_kwds={'color': '#eeeeee', 'label': 'Missing values'})
borders.plot(ax=ax, color='white', linewidth=0.5)

legend = ax.get_legend()
legend.set_label('GDP per capita')

plt.axis('off')
plt.savefig('world_gdp_map.pdf', bbox_inches='tight')
plt.savefig('world_gdp_map.png', bbox_inches='tight')