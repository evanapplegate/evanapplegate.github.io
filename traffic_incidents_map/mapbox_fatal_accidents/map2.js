const {MapboxOverlay} = deck;
const {ScatterplotLayer} = deck;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  accessToken: MAPBOX_TOKEN,
  center: [-111.8910, 39.3210], // Utah, US
  zoom: 6,
  bearing: 0,
  pitch: 0
});

const deckOverlay = new MapboxOverlay({
  layers: []
});

map.addControl(deckOverlay);
map.addControl(new mapboxgl.NavigationControl());

let features = [];

const updateScatterplotLayer = (zoom) => {
//   const sizeScale = 1 / Math.pow(2, zoom - 6); // Adjust the scale factor as needed

  const scatterplotLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: features,
    getPosition: d => d.position,
    // getRadius: d => d.radius * sizeScale, // Adjust radius based on zoom
    getFillColor: d => d.color,
    stroked: true,
    getLineColor: d => d.lineColor,
    getLineWidth: d => d.lineWidth,
    radiusMaxPixels: 5, // Set the maximum radius in pixels
    radiusUnits: 'pixels',
    lineWidthMinPixels: .5,
    lineWidthMaxPixels: .5,
    pickable: true
  });

  deckOverlay.setProps({
    layers: [scatterplotLayer]
  });
};

map.on('zoom', () => {
  const zoom = map.getZoom();
  updateScatterplotLayer(zoom);
});

fetch('2012_2022_fatal_accidents.geojson')
  .then(response => response.json())
  .then(data => {
    features = data.features.map(feature => ({
      position: feature.geometry.coordinates,
      radius: Math.sqrt(feature.properties.FATALS) * 3000,
      color: [255, 41, 43, 50],
      lineColor: [255, 0, 0], // Red color for stroke
      lineWidth: 2, // 1pt stroke width
    }));

    updateScatterplotLayer(map.getZoom());
  });