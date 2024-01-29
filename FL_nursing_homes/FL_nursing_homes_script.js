// Initialize Leaflet maps
var map_nursing_homes = L.map('map_nursing_homes').setView([27.994402, -81.760254], 7);
var map_assisted_living = L.map('map_assisted_living').setView([27.994402, -81.760254], 7);

// Add tile layers
L.tileLayer('https://api.mapbox.com/styles/v1/evandapplegate/ckljyc21f1de617qmasjc1ybf/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map_nursing_homes);

L.tileLayer('https://api.mapbox.com/styles/v1/evandapplegate/ckljyc21f1de617qmasjc1ybf/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map_assisted_living);

// Add layers to nursing home map
// Add all nursing homes layer
var nursingHomesLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 4,
      fillColor: '#DAAEC4',
      fillOpacity: 0.3,
      stroke: false,
      //color: '#e8bf90',
      //weight: 0.5,
      //opacity: 1
    });
  },
    filter: function (feature) {
    return feature.properties.overall_inspection === '★★☆☆☆' || feature.properties.overall_inspection === '★★★☆☆' || feature.properties.overall_inspection === '★★★★☆' ;
  },
  onEachFeature: function (feature, layer) {
    var tooltipContent = `
      <strong>Nursing Home:</strong> ${feature.properties.nursing_home_label}<br>
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
}).addTo(map_nursing_homes);

// Add nursing homes layers based on overall_inspection value
// add 5 star nursing homes
var nursingHomesLayer5Star = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: '#6abfcb',
      fillOpacity: 0.3,
      stroke: true,
      color: '#6abfcb',
      weight: 0.5,
      opacity: 1
    });
  },
  filter: function (feature) {
    return feature.properties.overall_inspection === '★★★★★';
  },
  onEachFeature: function (feature, layer) {
    var tooltipContent = `
      <strong>Nursing Home:</strong> ${feature.properties.nursing_home_label}<br>
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
}).addTo(map_nursing_homes);

// add 1 star nursing homes
var nursingHomesLayer1Star = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: '#e78c88',
      fillOpacity: 0.3,
      stroke: true,
      color: '#e78c88',
      weight: 0.5,
      opacity: 1
    });
  },
  filter: function (feature) {
    return feature.properties.overall_inspection === '★☆☆☆☆';
  },
  onEachFeature: function (feature, layer) {
    var tooltipContent = `
      <strong>Nursing Home:</strong> ${feature.properties.nursing_home_label}<br>
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
}).addTo(map_nursing_homes);

// Add regions layer
var regionsLayer_nursing_homes = L.geoJSON(null, {
  style: {
    fill: false,
    weight: 2,
    color: '#afa79f',
    opacity: 0.25
  }
}).addTo(map_nursing_homes);


// Add assisted living facilities layer to second map

// add all ALFs cept for the class 1, 2 violators
var assistedLivingLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 4,
      fillColor: '#DAAEC4',
      fillOpacity: 0.3,
      stroke: false,
      //color: '#DAAEC4',
      //weight: 0.5,
      //opacity: 1
    });
  },
    filter: function (feature) {
    return feature.properties.class_1 === 0 && feature.properties.class_2 === 0 ;
  },
  onEachFeature: function (feature, layer) {
    var fines = feature.properties.fines ? '$' + numberWithCommas(feature.properties.fines) : 'N/A';
    var tooltipContent = `
      <strong>Assisted living facility:</strong> ${feature.properties.assisted_living_facility_label}<br>
      <strong>Beds:</strong> ${feature.properties.beds}<br>
      <strong>Substantiated complaints:</strong> ${feature.properties.no_substantiated_complaints}<br>
      <strong>Fines, 6/2018 to 6/2023:</strong> ${fines}<br>
      <strong>Class 1 violations:</strong> ${feature.properties.class_1}<br>
      <strong>Class 2 violations:</strong> ${feature.properties.class_2}
    `;
    layer.bindTooltip(tooltipContent, { direction: 'top', permanent: false, className: 'tooltip' });
  }
}).addTo(map_assisted_living);

// add class 1 violator ALFs
var assistedLivingClass1Layer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: '#e78c88',
      fillOpacity: 0.3,
      stroke: true,
      color: '#e78c88',
      weight: 1,
      opacity: 1
    });
  },
    filter: function (feature) {
    return feature.properties.class_1 > 0;
  },
  onEachFeature: function (feature, layer) {
    var fines = feature.properties.fines ? '$' + numberWithCommas(feature.properties.fines) : 'N/A';
    var tooltipContent = `
      <strong>Assisted living facility:</strong> ${feature.properties.assisted_living_facility_label}<br>
      <strong>Beds:</strong> ${feature.properties.beds}<br>
      <strong>Substantiated complaints:</strong> ${feature.properties.no_substantiated_complaints}<br>
      <strong>Fines, 6/2018 to 6/2023:</strong> ${fines}<br>
      <strong>Class 1 violations:</strong> ${feature.properties.class_1}<br>
      <strong>Class 2 violations:</strong> ${feature.properties.class_2}
    `;
    layer.bindTooltip(tooltipContent, { direction: 'top', permanent: false, className: 'tooltip' });
  }
}).addTo(map_assisted_living);

// add class 1 violator ALFs
var assistedLivingClass2Layer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: '#e8bf90',
      fillOpacity: 0.3,
      stroke: true,
      color: '#e8bf90',
      weight: 1,
      opacity: 1
    });
  },
    filter: function (feature) {
    return feature.properties.class_2 > 0;
  },
  onEachFeature: function (feature, layer) {
    var fines = feature.properties.fines ? '$' + numberWithCommas(feature.properties.fines) : 'N/A';
    var tooltipContent = `
      <strong>Assisted living facility:</strong> ${feature.properties.assisted_living_facility_label}<br>
      <strong>Beds:</strong> ${feature.properties.beds}<br>
      <strong>Substantiated complaints:</strong> ${feature.properties.no_substantiated_complaints}<br>
      <strong>Fines, 6/2018 to 6/2023:</strong> ${fines}<br>
      <strong>Class 1 violations:</strong> ${feature.properties.class_1}<br>
      <strong>Class 2 violations:</strong> ${feature.properties.class_2}
    `;
    layer.bindTooltip(tooltipContent, { direction: 'top', permanent: false, className: 'tooltip' });
  }
}).addTo(map_assisted_living);

// Function to add commas for thousands
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



// Load GeoJSON data and add to respective layers
fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/assisted_living_facilities.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    assistedLivingLayer.addData(data);
    assistedLivingClass2Layer.addData(data);
    assistedLivingClass1Layer.addData(data);
  });

fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/nursing_homes.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    nursingHomesLayer.addData(data);
    nursingHomesLayer5Star.addData(data);
    nursingHomesLayer1Star.addData(data);
    nursingHomesLayer.addTo(map_nursing_homes); // Add nursingHomesLayer to map by default
  });

fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/FL_nursing_homes/FL_regions_WGS84.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    regionsLayer_nursing_homes.addData(data);
  });

// Checkbox event listeners
var nursingHomesCheckbox = document.getElementById('nursingHomesCheckbox');
nursingHomesCheckbox.addEventListener('change', function () {
  if (this.checked) {
    map_nursing_homes.addLayer(nursingHomesLayer);
  } else {
    map_nursing_homes.removeLayer(nursingHomesLayer);
  }
});

var nursingHomes5StarCheckbox = document.getElementById('nursingHomes5StarCheckbox');
nursingHomes5StarCheckbox.addEventListener('change', function () {
  if (this.checked) {
    map_nursing_homes.addLayer(nursingHomesLayer5Star);
  } else {
    map_nursing_homes.removeLayer(nursingHomesLayer5Star);
  }
});

var nursingHomes1StarCheckbox = document.getElementById('nursingHomes1StarCheckbox');
nursingHomes1StarCheckbox.addEventListener('change', function () {
  if (this.checked) {
    map_nursing_homes.addLayer(nursingHomesLayer1Star);
  } else {
    map_nursing_homes.removeLayer(nursingHomesLayer1Star);
  }
});

var regionsCheckbox_nursing_homes = document.getElementById('regionsCheckbox_nursing_homes');
regionsCheckbox_nursing_homes.addEventListener('change', function () {
  if (this.checked) {
    map_nursing_homes.addLayer(regionsLayer_nursing_homes);
  } else {
    map_nursing_homes.removeLayer(regionsLayer_nursing_homes);
  }
});

var assistedLivingCheckbox = document.getElementById('assistedLivingCheckbox');
assistedLivingCheckbox.addEventListener('change', function () {
  if (this.checked) {
    map.addLayer(assistedLivingLayer);
    nursingHomesLayer.bringToBack();
  } else {
    map.removeLayer(assistedLivingLayer);
  }
});
