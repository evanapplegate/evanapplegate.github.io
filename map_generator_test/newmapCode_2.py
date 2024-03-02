import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Load data
gdp_data = pd.read_excel('uploads/world_gdp.xlsx')
countries = gpd.read_file('map_data/countries.geojson')
country_bounds = gpd.read_file('map_data/country_bounds.geojson')

# Merge GDP data with countries
countries = countries.merge(gdp_data, on='NAME', how='left')

# Define color scheme
color_scheme = ['#eeeeee', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837']
classes = pd.qcut(countries['gdp_per_capita'].dropna(), 5, labels=False)
colors = classes.map(lambda x: color_scheme[x + 1] if pd.notnull(x) else color_scheme[0])
countries['color'] = colors

# Plot
fig, ax = plt.subplots(figsize=(10, 10))
countries.to_crs('ESRI:54030').plot(ax=ax, color=countries['color'], edgecolor='none')
country_bounds.to_crs('ESRI:54030').plot(ax=ax, color='white', linewidth=0.5)
plt.axis('off')

# Legend
class_values = pd.qcut(countries['gdp_per_capita'].dropna(), 5).unique()
class_colors = color_scheme[1:6]
handles = [plt.Line2D([0], [0], marker='o', color='w', markerfacecolor=cl, markersize=10) for cl in class_colors]
labels = [str(value) for value in class_values]
plt.legend(handles, labels, title='GDP per capita 2022')

plt.savefig('world_map.pdf', bbox_inches='tight')
plt.savefig('world_map.png', bbox_inches='tight')