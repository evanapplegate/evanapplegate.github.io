      // zoom map to NYC
      var map = L.map('map').setView([40.7128, -74.0060], 10);

      // Add the tile layer
      // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png').addTo(map);
         L.tileLayer('https://api.mapbox.com/styles/v1/evandapplegate/ckljyc21f1de617qmasjc1ybf/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw').addTo(map);


      // Create two panes for the map data
      map.createPane('zero-kill-pane');
      map.createPane('non-zero-kill-pane');

      // Set the z-index of the panes
      map.getPane('zero-kill-pane').style.zIndex = 400;
      map.getPane('non-zero-kill-pane').style.zIndex = 501;

      // Create a marker cluster group for each pane
      // non-fatal pane
      var zeroKillCluster = L.markerClusterGroup({
        pane: 'zero-kill-pane',
        iconCreateFunction: function (cluster) {
          var childCount = cluster.getChildCount();
          var clusterClass = 'cluster-nonfatal-zero';

          if (childCount >= 100 && childCount < 500) {
            clusterClass = 'cluster-nonfatal-medium';
          } else if (childCount >= 500) {
            clusterClass = 'cluster-nonfatal-high';
          }

          return L.divIcon({
            html: '<div><span>' + childCount + '</span></div>',
            className: 'marker-cluster ' + clusterClass,
            iconSize: L.point(40, 40),
          });
        },
      });

      // fatal pane
      var nonZeroKillCluster = L.markerClusterGroup({
        pane: 'non-zero-kill-pane',
        iconCreateFunction: function (cluster) {
          var childCount = cluster.getChildCount();
          var clusterClass = 'cluster-fatal-zero';

          if (childCount >= 100 && childCount < 500) {
            clusterClass = 'cluster-fatal-medium';
          } else if (childCount >= 500) {
            clusterClass = 'cluster-fatal-high';
          }

          return L.divIcon({
            html: '<div><span>' + childCount + '</span></div>',
            className: 'marker-cluster ' + clusterClass,
            iconSize: L.point(40, 40),
          });
        },
      });

      var zeroKillData = []; // Array for storing zero-kill data
      var nonZeroKillData = []; // Array for storing non-zero-kill data

      // Load the GeoJSON and process it
      fetch('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/2022_crashes_less_precision.geojson')
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonData) {
        // Process the GeoJSON data
        jsonData.features.forEach(function (feature) {
          var numberOfPersonsKilled = feature.properties['NUMBER OF PERSONS KILLED'];

          // Create a marker based on the number of persons killed
          var marker;

          if (numberOfPersonsKilled === 0) {
            // Create a circle marker for zero-kill
            marker = L.circleMarker(feature.geometry.coordinates.reverse(), {
              radius: 4,
              color: '#788098',
              fillColor: '#788098',
              fillOpacity: 1,
            });
            marker.addTo(zeroKillCluster);
            zeroKillData.push(marker);
          } else {
            // Create a circle marker for non-zero-kill
            marker = L.circleMarker(feature.geometry.coordinates.reverse(), {
              radius: 4,
              color: '#e77a89',
              fillColor: '#e77a89',
              fillOpacity: 1,
            });
            marker.addTo(nonZeroKillCluster);
            nonZeroKillData.push(marker);
          }

          marker.feature = feature; // Store the feature object within the marker

          // Create a tooltip for the marker
          marker.bindTooltip(
            'Injured: ' + feature.properties['NUMBER OF PERSONS INJURED'] +
            '<br>Dead: ' + numberOfPersonsKilled
          );
        });

          // Add the zero-kill cluster group to the map
          map.addLayer(zeroKillCluster);

          // Add the non-zero-kill cluster group to the map
          map.addLayer(nonZeroKillCluster);

          // Configure the time slider
          var slider = document.getElementById('slider');

          var labels = [
            '12a', '', '', '', '', '', '6a', '', '', '', '', '', '12p',
            '', '', '', '', '', '6p', '', '', '', '', '', '11:59p'
          ];

          noUiSlider.create(slider, {
            start: [0, 24], // Initial time range
            connect: true,
            step: 1,
            range: {
              min: 0,
              max: 24,
            },
            pips: {
              mode: 'values',
              values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
              density: 4,
              format: {
                to: function (value) {
                  return labels[value];
                },
                from: function (value) {
                  return labels.indexOf(value);
                },
              },
            },
          });


          // Slider event handling
          slider.noUiSlider.on('change', function (values) {
            var minTime = parseInt(values[0]);
            var maxTime = parseInt(values[1]);

            // Filter the markers based on the time range
            var filteredZeroKillData = zeroKillData.filter(function (marker) {
              var feature = marker.feature; // Get the feature object from the marker
              var crashTime = feature.properties['CRASH TIME'];
              var hours = parseInt(crashTime.split(':')[0]);
              return hours >= minTime && hours <= maxTime;
            });

            var filteredNonZeroKillData = nonZeroKillData.filter(function (marker) {
              var feature = marker.feature; // Get the feature object from the marker
              var crashTime = feature.properties['CRASH TIME'];
              var hours = parseInt(crashTime.split(':')[0]);
              return hours >= minTime && hours <= maxTime;
            });

            // Update the marker cluster groups
            zeroKillCluster.clearLayers();
            zeroKillCluster.addLayers(filteredZeroKillData);

            nonZeroKillCluster.clearLayers();
            nonZeroKillCluster.addLayers(filteredNonZeroKillData);
          });
        })
        .catch(function (error) {
          console.log('Error:', error);
        });

      // Checkbox event listeners
      var zeroKillToggle = document.getElementById('zero-kill-toggle');
      var nonZeroKillToggle = document.getElementById('non-zero-kill-toggle');

      zeroKillToggle.addEventListener('change', function () {
        if (this.checked) {
          // Add the zero-kill cluster group to the map
          map.addLayer(zeroKillCluster);
        } else {
          // Remove the zero-kill cluster group from the map
          map.removeLayer(zeroKillCluster);
        }
      });

      nonZeroKillToggle.addEventListener('change', function () {
        if (this.checked) {
          // Add the non-zero-kill cluster group to the map
          map.addLayer(nonZeroKillCluster);
        } else {
          // Remove the non-zero-kill cluster group from the map
          map.removeLayer(nonZeroKillCluster);
        }
      });
