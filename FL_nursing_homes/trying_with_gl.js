// Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw';

// Initialize Mapbox maps
var mapNursingHomes = new mapboxgl.Map({
  container: 'map_nursing_homes', // container ID
  style: 'mapbox://styles/evandapplegate/clrwzxv8b016s01pbgmsa8fcs', // style URL
  center: [-81.760254, 27.994402], // starting position [lng, lat]
  zoom: 7 // starting zoom
});

var mapAssistedLiving = new mapboxgl.Map({
  container: 'map_assisted_living', // container ID
  style: 'mapbox://styles/evandapplegate/clrwzxv8b016s01pbgmsa8fcs', // style URL
  center: [-81.760254, 27.994402], // starting position [lng, lat]
  zoom: 7 // starting zoom
});

// Load GeoJSON data and add to maps as layers
mapNursingHomes.on('load', function () {
  mapNursingHomes.addSource('nursingHomes', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/nursing_homes.geojson'
  });

  // Add nursing homes layer
  mapNursingHomes.addLayer({
    id: 'nursingHomesLayer',
    type: 'circle',
    source: 'nursingHomes',
    paint: {
      'circle-radius': 4,
      'circle-color': '#DAAEC4',
      'circle-opacity': 0.3
    },
    filter: ['any', ['==', ['get', 'overall_inspection'], '★★☆☆☆'], ['==', ['get', 'overall_inspection'], '★★★☆☆'], ['==', ['get', 'overall_inspection'], '★★★★☆']]
  });

  // Add regions layer
  mapNursingHomes.addSource('regions', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/FL_regions_WGS84.geojson'
  });

  mapNursingHomes.addLayer({
    id: 'regionsLayer',
    type: 'line',
    source: 'regions',
    paint: {
      'line-width': 2,
      'line-color': '#afa79f',
      'line-opacity': 0.25
    }
  });
});

mapAssistedLiving.on('load', function () {
  mapAssistedLiving.addSource('assistedLivingFacilities', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/assisted_living_facilities.geojson'
  });

  // Add ALFs layer excluding class 1 and 2 violators
  mapAssistedLiving.addLayer({
    id: 'assistedLivingLayer',
    type: 'circle',
    source: 'assistedLivingFacilities',
    paint: {
      'circle-radius': 4,
      'circle-color': '#DAAEC4',
      'circle-opacity': 0.3
    },
    filter: ['all', ['==', ['get', 'class_1'], 0], ['==', ['get', 'class_2'], 0]]
  });
});

// Event listeners for checkbox changes to toggle layers
document.getElementById('nursingHomesCheckbox').addEventListener('change', function (e) {
  mapNursingHomes.setLayoutProperty('nursingHomesLayer', 'visibility', e.target.checked ? 'visible' : 'none');
});

document.getElementById('regionsCheckbox_nursing_homes').addEventListener('change', function (e) {
  mapNursingHomes.setLayoutProperty('regionsLayer', 'visibility', e.target.checked ? 'visible' : 'none');
});

document.getElementById('assistedLivingCheckbox').addEventListener('change', function (e) {
  mapAssistedLiving.setLayoutProperty('assistedLivingLayer', 'visibility', e.target.checked ? 'visible' : 'none');
});

// Add tooltips
mapNursingHomes.on('mouseenter', 'nursingHomesLayer', function (e) {
  // Create tooltip content and set options
  var coordinates = e.features[0].geometry.coordinates.slice();
  var description = `<strong>Nursing Home:</strong> ${e.features[0].properties.nursing_home_label}<br>`;
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(mapNursingHomes);
});
