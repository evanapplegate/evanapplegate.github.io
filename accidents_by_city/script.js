// Initialize Leaflet map
var map = L.map('accident_cities').setView([37.09, -95.71], 4);

// Add tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Load data from CSV
var csvUrl = 'https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/table_124_NHTSA.csv';

fetch(csvUrl)
    .then(function (response) {
        return response.text();
    })
    .then(function (text) {
        var csvData = Papa.parse(text, { header: true, dynamicTyping: true }).data;
        plotCircles(csvData);
    });

// Plot circles on the map
function plotCircles(data) {
    var circles = L.layerGroup().addTo(map);

    data.forEach(function (row) {
        var radius = Math.abs(row.change_total_dead_per_100k) * 10;
        var fillColor = getFillColor(row.change_total_dead_per_100k);

        var circle = L.circleMarker([row.lat, row.lng], {
            radius: radius,
            fillColor: fillColor,
            fillOpacity: 0.25,
            stroke: false,
        });

        circle.bindTooltip(getTooltipContent(row), {
            direction: 'top',
            offset: [0, -10],
        });

        circles.addLayer(circle);
    });
}

// Get fill color based on change_total_dead_per_100k value
function getFillColor(value) {
    if (value >= 0.51) {
        return '#ce572b';
    } else if (value >= 0.26 && value <= 0.5) {
        return '#e9865b';
    } else if (value >= 0.01 && value <= 0.25) {
        return '#f5d0bf';
    } else if (value >= -0.25 && value < 0) {
        return '#b1bddb';
    }
}

// Get tooltip content
function getTooltipContent(row) {
    var tooltipContent = '<h3>City: ' + row.city + '</h3>';
    tooltipContent += '<p>2020 vehicle accident deaths: ' + row['2020_total_deaths'] + '</p>';
    tooltipContent += '<p>Change in vehicle accident death rate per 100k people, 2010-2020: ' + formatPercentage(row.change_total_dead_per_100k) + '</p>';

    return tooltipContent;
}

// Format change_total_dead_per_100k as percentage
function formatPercentage(value) {
    var percentage = Math.abs(value) * 100;
    var formattedPercentage = percentage.toFixed(0) + '%';

    if (value >= 0) {
        formattedPercentage = '+' + formattedPercentage;
    }

    return formattedPercentage;
}

// Event handler for checkboxes
function handleCheckboxChange(event) {
    var boxId = event.target.id;
    var layer = null;

    if (boxId === 'box1') {
        layer = L.GeoJSON;
    } else if (boxId === 'box2') {
        layer = L.GeoJSON;
    } else if (boxId === 'box3') {
        layer = L.GeoJSON;
    }

    if (event.target.checked) {
        map.addLayer(layer);
    } else {
        map.removeLayer(layer);
    }
}

// Attach event listeners to checkboxes
var checkboxes = document.querySelectorAll('#city-size-toggle input[type="checkbox"]');
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', handleCheckboxChange);
});
