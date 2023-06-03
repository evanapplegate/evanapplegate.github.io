var map = L.map('map').setView([40.7128, -74.0060], 10);

// Add the tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png').addTo(map);

// Create a marker cluster group
var markerCluster = L.markerClusterGroup();

var data; // Declare the data variable

// Load the GeoJSON data and add it to the marker cluster group
fetch('https://raw.githubusercontent.com/evanapplegate/testpile/main/2022_crashes3.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (jsonData) {
    // Store the GeoJSON data in the data variable
    data = jsonData;

    // Create a custom icon for the blue markers
    var blueIcon = L.divIcon({
      className: 'blue-icon',
      iconSize: [6, 6],
    });

    // Create a custom icon for the red markers
    var redIcon = L.divIcon({
      className: 'red-icon',
      iconSize: [8, 8],
    });

    // Create a custom style function for the GeoJSON layer
    function style(feature) {
      var numberOfPersonsKilled = feature.properties['NUMBER OF PERSONS KILLED'];
      var fillColor = numberOfPersonsKilled > 0 ? 'red' : 'orange';
      var fillOpacity = numberOfPersonsKilled > 0 ? 1 : 0.2;
      var radius = numberOfPersonsKilled > 0 ? 4 : 3;
      return {
        radius: radius,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        color: fillColor,
        weight: 1,
        riseOnHover: true, // Ensure points appear on top on hover
      };
    }

    // Create a GeoJSON layer with custom styling and tooltip
    var geojsonLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var numberOfPersonsKilled = feature.properties['NUMBER OF PERSONS KILLED'];
        var icon = numberOfPersonsKilled > 0 ? redIcon : blueIcon;
        return L.marker(latlng, { icon: icon });
      },
      onEachFeature: function (feature, layer) {
        var tooltipContent =
          'Injured: ' + feature.properties['NUMBER OF PERSONS INJURED'] +
          '<br>Deaths: ' + feature.properties['NUMBER OF PERSONS KILLED'];
        layer.bindTooltip(tooltipContent);
      },
    });

    // Add the GeoJSON layer to the marker cluster group
    markerCluster.addLayer(geojsonLayer);

    // Add the marker cluster group to the map
    map.addLayer(markerCluster);

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
      // Filter the GeoJSON layer based on the time range
      var timeRange = values.map(function (value) {
        return parseInt(value);
      });

      // Remove the GeoJSON layer from the map
      map.removeLayer(markerCluster);

      // Clear the marker cluster group
      markerCluster.clearLayers();

      // Create a new filtered GeoJSON layer
      var filteredGeojsonLayer = L.geoJSON(data, {
        filter: function (feature) {
          var crashTime = feature.properties['CRASH TIME'];
          var hours = parseInt(crashTime.split(':')[0]);
          return hours >= timeRange[0] && hours <= timeRange[1];
        },
        style: style,
        pointToLayer: function (feature, latlng) {
          var numberOfPersonsKilled = feature.properties['NUMBER OF PERSONS KILLED'];
          var icon = numberOfPersonsKilled > 0 ? redIcon : blueIcon;
          return L.marker(latlng, { icon: icon });
        },
        onEachFeature: function (feature, layer) {
          var tooltipContent =
            'Injured: ' + feature.properties['NUMBER OF PERSONS INJURED'] +
            '<br>Deaths: ' + feature.properties['NUMBER OF PERSONS KILLED'];
          layer.bindTooltip(tooltipContent);
        },
      });

      // Add the filtered GeoJSON layer to the marker cluster group
      markerCluster.addLayer(filteredGeojsonLayer);

      // Add the marker cluster group back to the map
      map.addLayer(markerCluster);
    });
  })
  .catch(function (error) {
    console.log('Error:', error);
  });
