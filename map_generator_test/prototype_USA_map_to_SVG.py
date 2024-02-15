import geopandas as gpd
import matplotlib.pyplot as plt

plt.rcParams['pdf.fonttype'] = 42
plt.rcParams['ps.fonttype'] = 42
plt.rcParams['font.family'] = ['Arial']

# Load the GeoJSON files
gdf_states = gpd.read_file('US_states.geojson')
gdf_bounds = gpd.read_file('US_bounds.geojson')

# Set the CRS to EPSG:4326 if it's not already set
gdf_states = gdf_states.set_crs("EPSG:4326", allow_override=True)
gdf_bounds = gdf_bounds.set_crs("EPSG:4326", allow_override=True)

# Define the PROJ string for the desired projection
albers_proj = "+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=37.5 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs"

# Reproject the GeoDataFrames using the PROJ string
gdf_states = gdf_states.to_crs(albers_proj)
gdf_bounds = gdf_bounds.to_crs(albers_proj)

# Define a color map: red for specified states, light gray for others
color_map = gdf_states['postal'].map(lambda x: 'red' if x in ['AR', 'AL', 'LA'] else 'lightgray')

# Plotting
fig, ax = plt.subplots(figsize=(10, 10))  # Adjust the figure size as needed
gdf_states.plot(ax=ax, color=color_map)  # Plot the states
gdf_bounds.plot(ax=ax, color='white', linewidth=1)  # Plot the borders with white stroke

# Check for intersection with the lines from gdf_bounds
for idx, row in gdf_states.iterrows():
    centroid = row.geometry.centroid  # Get the centroid of the polygon
    # Check for intersection with lines from gdf_bounds
    intersection = False
    for _, boundary in gdf_bounds.iterrows():
        if centroid.intersects(boundary.geometry):  # If intersection detected
            intersection = True
            break
    # If intersection detected, adjust text position
    if intersection:
        ax.text(centroid.x, centroid.y, row['postal'], ha='left', va='bottom', color='white', fontsize=7)
    else:
        ax.text(centroid.x, centroid.y, row['postal'], ha='center', va='center', color='white', fontsize=7)

ax.axis('off')  # Turn off the axis

# Save the plot as a PDF file with text as text, not paths
plt.savefig('US_states_map.pdf', format='pdf', bbox_inches='tight', transparent=True)
