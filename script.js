var map = L.map('map').setView([40.7128, -74.0060], 11);

// Add the tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png').addTo(map);

var geojsonLayer; // Store the GeoJSON layer

// Load the GeoJSON data and add it to the map
fetch('https://raw.githubusercontent.com/evanapplegate/testpile/main/2022_crashes3.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // Create a custom style function for the GeoJSON layer
    function style(feature) {
      var numberOfPersonsKilled = feature.properties['NUMBER OF PERSONS KILLED'];
      var fillColor = numberOfPersonsKilled > 0 ? '#ac452d' : '#e5bd5d';
      var fillOpacity = numberOfPersonsKilled > 0 ? 1 : 0.2;
      var radius = numberOfPersonsKilled > 0 ? 4 : 3;
      return {
        radius: radius,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        color: fillColor,
        weight: .2,
        riseOnHover: true, // Ensure points appear on top on hover
      };
    }

    // Create a GeoJSON layer with custom styling and tooltip
    geojsonLayer = L.geoJSON(data, {
      style: style,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      onEachFeature: function (feature, layer) {
        var tooltipContent =
          'Injured: ' + feature.properties['NUMBER OF PERSONS INJURED'] +
          '<br>Deaths: ' + feature.properties['NUMBER OF PERSONS KILLED'];
        layer.bindTooltip(tooltipContent);
      },
    }).addTo(map);
  });

    // Create a legend
    var legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML +=
        '<div><span class="legend-circle" style="background-color: red;"></span>Crash with deaths</div>' +
        '<div><span class="legend-circle" style="background-color: orange;"></span>Crash with injuries only</div>';
      return div;
    };
    legend.addTo(map);


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
  pips: {
    mode: 'positions',
    values: [0, 100],
    density: 4,
    format: {
      to: function (value) {
        if (value === 0) return '12a';
        if (value === 24) return '11:59p';
        return value + 'h';
      },
    },
  },
});

slider.noUiSlider.on('update', function (values, handle) {
  // Filter the GeoJSON layer based on the time range
  var timeRange = values.map(function (value) {
    return parseInt(value);
  });

  geojsonLayer.eachLayer(function (layer) {
    var crashTime = parseInt(layer.feature.properties['CRASH TIME'].split(':')[0]);
    if (crashTime >= timeRange[0] && crashTime <= timeRange[1]) {
      layer.setStyle({ opacity: 1 });
      layer.addTo(map);
    } else {
      layer.setStyle({ opacity: 0 });
      map.removeLayer(layer);
    }
  });
});