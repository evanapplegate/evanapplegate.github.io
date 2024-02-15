import geopandas as gpd
import matplotlib.pyplot as plt

# Setting the matplotlib parameters
plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Loading the GeoJSON data
states = gpd.read_file('US_states.geojson')
borders = gpd.read_file('US_bounds.geojson')

# Color conditions
colors = {'CA': 'red', 'MN': 'red', 'NV': 'red', 'WA': 'red',
          'NY': 'blue', 'OR': 'blue'}
states['color'] = states['postal'].apply(lambda x: colors.get(x, 'lightgrey'))

# Setting up the figure and axis
fig, ax = plt.subplots(figsize=(12, 8))

# Plot the states
states.to_crs(epsg=2163).plot(column='color', ax=ax, linewidth=0, edgecolor=None, legend=True)

# Plot borders
borders.to_crs(epsg=2163).plot(ax=ax, color='white', linewidth=1)

# Adding postal code labels
for _, row in states.iterrows():
    plt.text(s=row['postal'], x=row.geometry.centroid.x, y=row.geometry.centroid.y,
             horizontalalignment='center', verticalalignment='center',
             fontsize=8, transform=ax.transData, color='black')

# Removing axis
ax.set_axis_off()

# Saving the outputs
plt.savefig("map_output.pdf", bbox_inches='tight')
plt.savefig("map_output.png", bbox_inches='tight')