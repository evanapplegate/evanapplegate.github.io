import geopandas as gpd
import matplotlib.pyplot as plt

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = 'Arial'

# Load GeoJSON files
states = gpd.read_file('US_states.geojson')
bounds = gpd.read_file('US_bounds.geojson')

# Specify colors for states
state_colors = {'CA': 'red', 'MN': 'red', 'NV': 'red', 'WA': 'red',
                'NY': 'blue', 'OR': 'blue'}

# Apply colors
states['color'] = states['postal'].apply(lambda x: state_colors.get(x, 'lightgrey'))

# Plot setup
fig, ax = plt.subplots(figsize=(10, 6))
ax.set_aspect('equal')

# Reproject to a suitable projection
states = states.to_crs('esri:102003')

# Plot states with colors
states.plot(ax=ax, color=states['color'], edgecolor='none')

# Plot borders
bounds.to_crs(states.crs).plot(ax=ax, color='white', linewidth=1)

# Add labels
for idx, row in states.iterrows():
    plt.text(row.geometry.centroid.x, row.geometry.centroid.y, row['postal'],
             horizontalalignment='center', verticalalignment='center',
             fontsize=9, fontweight='normal', color='black')

# Remove axis
ax.axis('off')

# Save figures
plt.savefig('US_map.pdf', bbox_inches='tight')
plt.savefig('US_map.png', bbox_inches='tight')