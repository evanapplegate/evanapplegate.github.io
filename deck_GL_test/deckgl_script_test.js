// Your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw';

// Initialize a Mapbox map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.4, 37.8], // longitude, latitude of the map's center
    zoom: 12
});

// Add navigation control (zoom in/out) to the map
map.addControl(new mapboxgl.NavigationControl());

// Deck.gl GeoJSON layer
const geoJsonLayer = new deck.GeoJsonLayer({
    id: 'geojson-layer',
    data: 'all_month.geojson',
    // Define the visual aspects of the GeoJSON data
    filled: true,
    pointRadiusMinPixels: 2,
    opacity: 0.8,
    pointRadiusScale: 2000,
    getRadius: f => Math.sqrt(f.properties.mag) * 1000,
    getFillColor: [180, 0, 200, 140],
    pickable: true,
    onHover: ({object, x, y}) => {
        // Display properties of the hovered-over object (optional)
        const tooltip = document.getElementById('tooltip');
        if (object) {
            const { mag, place } = object.properties;
            tooltip.style.top = `${y}px`;
            tooltip.style.left = `${x}px`;
            tooltip.innerHTML = `
                <div><strong>Place:</strong> ${place}</div>
                <div><strong>Magnitude:</strong> ${mag}</div>
            `;
            tooltip.style.display = 'block';
        } else {
            tooltip.style.display = 'none';
        }
    }
});

// Initialize the DeckGL instance
new deck.DeckGL({
    mapboxApiAccessToken: 'pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw',
    mapStyle: 'mapbox://styles/mapbox/light-v10',
    initialViewState: {
        longitude: -122.4,
        latitude: 37.8,
        zoom: 12,
        pitch: 0,
        bearing: 0
    },
    controller: true,
    layers: [geoJsonLayer]
});