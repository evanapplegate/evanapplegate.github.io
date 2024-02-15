import geopandas as gpd
import matplotlib.pyplot as plt

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Load GeoJSON files
states = gpd.read_file('US_states.geojson')
bounds = gpd.read_file('US_bounds.geojson')

# Project the geometries to an appropriate projection
states = states.to_crs(epsg=2163)
bounds = bounds.to_crs(epsg=2163)

# Color mapping
state_colors = {'CA': 'red', 'MN': 'red', 'NV': 'red', 'WA': 'red', 'NY': 'blue', 'OR': 'blue'}
states['color'] = states['postal'].apply(lambda x: state_colors.get(x, 'lightgrey'))

# Plotting
fig, ax = plt.subplots(1, 1, figsize=(10, 6))
states.plot(ax=ax, color=states['color'], linewidth=0, edgecolor='none')
bounds.plot(ax=ax, color='white', linewidth=1)
for idx, row in states.iterrows():
    plt.text(row.geometry.centroid.x, row.geometry.centroid.y, row['postal'], horizontalalignment='center', verticalalignment='center', fontsize=9, color='black')
ax.set_axis_off()

plt.savefig('US_map.pdf', bbox_inches='tight')
plt.savefig('US_map.png', bbox_inches='tight')