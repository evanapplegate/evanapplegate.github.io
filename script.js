var map = L.map('map').setView([40.7128, -74.0060], 10);

// Add the tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png').addTo(map);

// Load the GeoJSON data and add it to the map
fetch('2022_crashes3.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // Create a custom icon
    var orangeIcon = L.divIcon({
      className: 'orange-marker',
      iconSize: [6, 6],
      iconAnchor: [3, 3],
    });

    // Create a GeoJSON layer with custom styling and tooltip
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: orangeIcon });
      },
      style: function (feature) {
        return {
          fillColor: 'orange',
          fillOpacity: 0.2,
          radius: 3, // Half of the desired diameter
          color: 'orange',
          weight: 1,
        };
      },
      onEachFeature: function (feature, layer) {
        var tooltipContent =
          'Injured: ' + feature.properties['NUMBER OF PERSONS INJURED'] +
          '<br>Deaths: ' + feature.properties['NUMBER OF PERSONS KILLED'];
        layer.bindTooltip(tooltipContent);
      },
    }).addTo(map);
  });

// Add a time slider
var slider = document.getElementById('time-slider');

noUiSlider.create(slider, {
  start: [0, 24], // Initial time range
  connect: true,
  step: 1,
  range: {
    min: 0,
    max: 24,
  },
  tooltips: true,
});

slider.noUiSlider.on('update', function (values, handle) {
  var timeRange = values.map(function (value) {
    return parseInt(value);
  });
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker && layer.feature) {
      var crashTime = parseInt(layer.feature.properties['CRASH TIME'].split(':')[0]);
      if (crashTime >= timeRange[0] && crashTime <= timeRange[1]) {
        layer.addTo(map);
      } else {
        map.removeLayer(layer);
      }
    }
  });
});