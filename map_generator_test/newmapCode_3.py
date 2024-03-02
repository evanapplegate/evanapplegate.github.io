import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd
from mpl_toolkits.axes_grid1 import make_axes_locatable

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

countries = gpd.read_file('map_data/countries.geojson').to_crs('ESRI:54030')
borders = gpd.read_file('map_data/country_bounds.geojson').to_crs('ESRI:54030')

# Load GDP data
gdp_data = pd.read_excel('uploads/world_gdp.xlsx')

# Merge the GDP data with the countries GeoDataFrame
countries_gdp = countries.merge(gdp_data, on='NAME', how='left')

# Define color map
cmap = 'YlGn'

# Plot
fig, ax = plt.subplots(1, 1, figsize=(15, 10))
divider = make_axes_locatable(ax)
cax = divider.append_axes("right", size="5%", pad=0.1)

countries_gdp.plot(column='gdp_per_capita', cmap=cmap, linewidth=0, ax=ax, legend=True, 
                   legend_kwds={'label': "GDP per capita 2022", 'orientation': "vertical"}, cax=cax,
                   missing_kwds={'color': '#eeeeee', 'label': 'No Data'},
                   scheme='quantiles', k=5)
borders.plot(ax=ax, color='white', linewidth=0.5)
plt.axis('off')
plt.savefig('map_gdp_per_capita.pdf', bbox_inches='tight')
plt.savefig('map_gdp_per_capita.png', bbox_inches='tight')