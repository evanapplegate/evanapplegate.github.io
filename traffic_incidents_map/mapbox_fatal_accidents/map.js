map.on('load', function() {
    fetch('./2012_2022_fatal_accidents.csv')
      .then(response => response.text())
      .then(csvData => {
        csv2geojson.csv2geojson(csvData, {
          latfield: 'LATITUDE',
          lonfield: 'LONGITUD',
          delimiter: ','
        }, (err, geojson) => {
            if (err) {
              console.error('Error converting CSV to GeoJSON:', err);
              return;
            }

            // Convert FATALS field to number
            geojson.features.forEach(feature => {
              feature.properties.FATALS = Number(feature.properties.FATALS);
            });

            map.addSource('accidents', {
              type: 'geojson',
              data: geojson
            });

            // Add the 'accidents' layer
            map.addLayer({
              id: 'accidents',
              type: 'circle',
              source: 'accidents',
              paint: {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['get', 'FATALS'],
                  1, 5,
                  10, 20
                ], // Scale circle size based on FATALS
                'circle-color': '#FF3332',
                'circle-opacity': 0.2, // 30% opacity fill
                'circle-stroke-color': 'red',
                'circle-stroke-width': .5,
                'circle-stroke-opacity': 0.5, // 75% opacity stroke
                'circle-blend-mode': 'color-dodge'
              }
            });
        });
      })
      .catch(error => {
        console.error('Error loading CSV data:', error);
      });
  });

// Create a custom control for the legend
var legendControl = {
  onAdd: function(map) {
    var container = document.createElement('div');
    container.className = 'mapboxgl-ctrl';

    // Create checkboxes for each vehicle type
    var vehicleTypes = ['Car', 'SUV', 'Heavy truck', 'Motorcycle', 'Bus', 'Pickup truck', 'Other', 'Farm or construction equipment', 'Light truck', 'Van'];

    vehicleTypes.forEach(function(type) {
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = type;
      checkbox.checked = true;

      var label = document.createElement('label');
      label.setAttribute('for', type);
      label.textContent = type;

      container.appendChild(checkbox);
      container.appendChild(label);
      container.appendChild(document.createElement('br'));
    });

    return container;
  }
};

// Add the custom control to the map
map.addControl(legendControl, 'top-right');

// Get all the checkboxes
var checkboxes = document.querySelectorAll('input[type=checkbox]');

// Attach event listeners to the checkboxes
checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    var selectedTypes = Array.from(checkboxes)
      .filter(function(checkbox) {
        return checkbox.checked;
      })
      .map(function(checkbox) {
        return checkbox.id;
      });

    // Update the filter based on the selected vehicle types
    map.setFilter('accidents', [
      'any',
      ['in', 'BODY_TYP_1_TEXT', ...selectedTypes],
      ['in', 'BODY_TYP_2_TEXT', ...selectedTypes],
      ['in', 'BODY_TYP_3_TEXT', ...selectedTypes],
      ['in', 'BODY_TYP_4_TEXT', ...selectedTypes],
      ['in', 'BODY_TYP_5_TEXT', ...selectedTypes]
    ]);
  });
});