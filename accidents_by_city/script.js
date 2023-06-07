// Define map and tile layer
let map = L.map('accident_cities').setView([39.833333, -98.583333], 4); // center to the United States
let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
    maxZoom: 18
}).addTo(map);

// Define the layer groups
let layerGroup1 = L.layerGroup().addTo(map);
let layerGroup2 = L.layerGroup().addTo(map);
let layerGroup3 = L.layerGroup().addTo(map);

// Load CSV and add circles to the map
Papa.parse('https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/accidents_by_city/table_124_NHTSA.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        for(let row of results.data) {
            let circleOptions = {
                radius: Math.abs(row.change_total_dead_per_100k) * 10,
                color: getFillColor(row.change_total_dead_per_100k),
                opacity: 0.25,
                stroke: false,
                fillOpacity: 0.25,
            };

            let circle = L.circle([row.latitude, row.longitude], circleOptions)
                .bindTooltip(`City: ${row.city}<br>2020 vehicle accident deaths: ${row['2020_total_deaths']}<br>Change in vehicle accident death rate per 100k people, 2010-2020: ${(row.change_total_dead_per_100k > 0 ? '+' : '') + (row.change_total_dead_per_100k * 100).toFixed(0) + '%'}`);

            if (row['2020_city_pop'] < 500000) {
                circle.addTo(layerGroup1);
            } else if (row['2020_city_pop'] >= 500000 && row['2020_city_pop'] <= 1000000) {
                circle.addTo(layerGroup2);
            } else if (row['2020_city_pop'] > 1000000) {
                circle.addTo(layerGroup3);
            }
        }
    }
});

// Event handlers for checkboxes
document.getElementById('box1').addEventListener('change', function(e) {
    if (e.target.checked) {
        layerGroup1.addTo(map);
    } else {
        layerGroup1.remove();
    }
});
document.getElementById('box2').addEventListener('change', function(e) {
    if (e.target.checked) {
        layerGroup2.addTo(map);
    } else {
        layerGroup2.remove();
    }
});
document.getElementById('box3').addEventListener('change', function(e) {
    if (e.target.checked) {
        layerGroup3.addTo(map);
    } else {
        layerGroup3.remove();
    }
});

function getFillColor(value) {
    if (value >= -0.25 && value <= 0) {
        return '#b1bddb';
    } else if (value > 0.01 && value <= 0.25) {
        return '#f5d0bf';
    } else if (value > 0.26 && value <= 0.5) {
        return '#e9865b';
    } else {
        return '#ce572b';
    }
}
