// Initialize Leaflet map
var map = L.map('map').setView([27.994402, -81.760254], 7);

// Add tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add nursing homes layer
var nursingHomesLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 4,
      fillColor: 'red',
      fillOpacity: 0.5,
      stroke: true,
      color: 'red',
      weight: 1,
      opacity: 1
    });
  },
  onEachFeature: function (feature, layer) {
    var tooltipContent = `
      <strong>Nursing Home Label:</strong> ${feature.properties.nursing_home_label}<br>
      <strong>Overall Inspection:</strong> ${feature.properties.overall_inspection}<br>
      <strong>Quality of Care:</strong> ${feature.properties.quality_of_care}<br>
      <strong>Quality of Life:</strong> ${feature.properties.quality_of_life}<br>
      <strong>Administration:</strong> ${feature.properties.administration}<br>
      <strong>Nutrition and Hydration:</strong> ${feature.properties.nutrition_and_hydration}<br>
      <strong>Restraints and Abuse:</strong> ${feature.properties.restraints_and_abuse}<br>
      <strong>Pressure Ulcers:</strong> ${feature.properties.pressure_ulcers}<br>
      <strong>Decline:</strong> ${feature.properties.decline}<br>
      <strong>Dignity:</strong> ${feature.properties.dignity}
    `;
    layer.bindTooltip(tooltipContent, { direction: 'top', permanent: false, className: 'tooltip' });
  }
}).addTo(map);

// Add assisted living facilities layer
var assistedLivingLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 4,
      fillColor: 'blue',
      fillOpacity: 0.5,
      stroke: true,
      color: 'blue',
      weight: 1,
      opacity: 1
    });
  },
  onEachFeature: function (feature, layer) {
    var tooltipContent = `
      <strong>Assisted Living Facility Label:</strong> ${feature.properties.assisted_living_facility_label}<br>
      <strong>Beds:</strong> ${feature.properties.beds}<br>
      <strong>No Substantiated Complaints:</strong> ${feature.properties.no_substantiated_complaints}<br>
      <strong>Fines:</strong> ${feature.properties.fines}<br>
      <strong>Class 1:</strong> ${feature.properties.class_1}<br>
      <strong>Class 2:</strong> ${feature.properties.class_2}
    `;
    layer.bindTooltip(tooltipContent, { direction: 'top', permanent: false, className: 'tooltip' });
  }
}).addTo(map);

// Add counties layer
var regionsLayer = L.geoJSON(null, {
  style: {
    fill: false,
    weight: 2,
    color: 'purple',
    opacity: 0.25
  }
}).addTo(map);

// Load GeoJSON data and add to respective layers
fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/nursing_homes.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    nursingHomesLayer.addData(data);
  });

fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/assisted_living_facilities.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    assistedLivingLayer.addData(data);
  });

fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/FL_regions_WGS84.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    regionsLayer.addData(data);
  });

// Checkbox event listeners
var nursingHomesCheckbox = document.getElementById('nursingHomesCheckbox');
nursingHomesCheckbox.addEventListener('change', function () {
  if (this.checked) {
    map.addLayer(nursingHomesLayer);
  } else {
    map.removeLayer(nursingHomesLayer);
  }
});

var assistedLivingCheckbox = document.getElementById('assistedLivingCheckbox');
assistedLivingCheckbox.addEventListener('change', function () {
  if (this.checked) {
    map.addLayer(assistedLivingLayer);
  } else {
    map.removeLayer(assistedLivingLayer);
  }
});

var regionsCheckbox = document.getElementById('regionsCheckbox');
regionsCheckbox.addEventListener('change', function () {
  if (this.checked) {
    map.addLayer(regionsLayer);
  } else {
    map.removeLayer(regionsLayer);
  }
});
