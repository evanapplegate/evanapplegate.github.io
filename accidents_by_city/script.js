let map = L.map('accident_cities').setView([38.5, -98.0], 4);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
    maxZoom: 19
}).addTo(map);

let panes = ['pane1', 'pane2', 'pane3'];

panes.forEach(function(pane) {
    map.createPane(pane);
});

let boxMapping = {
    'box1': 'pane1',
    'box2': 'pane2',
    'box3': 'pane3'
};

for (let box in boxMapping) {
    document.getElementById(box).addEventListener('change', function() {
        map.getPane(boxMapping[box]).style.display = this.checked ? 'block' : 'none';
    });
}

Papa.parse("https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/accidents_by_city/table_124_NHTSA.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        results.data.forEach(function(row) {
            let pane;
            if (row.city_pop_2020 < 500000) {
                pane = 'pane1';
            } else if (row.city_pop_2020 > 1000000) {
                pane = 'pane2';
            } else {
                pane = 'pane3';
            }

            let fillColor;
            if (row.change_total_dead_per_100k >= 0.51) {
                fillColor = '#ce572b';
            } else if (row.change_total_dead_per_100k >= 0.26) {
                fillColor = '#e9865b';
            } else if (row.change_total_dead_per_100k >= 0.01) {
                fillColor = '#f5d0bf';
            } else {
                fillColor = '#b1bddb';
            }

            let changePercent = (row.change_total_dead_per_100k >= 0) ? '+' : '';
            changePercent += (row.change_total_dead_per_100k * 100).toFixed(2) + '%';

            L.circle([row.latitude, row.longitude], {
                color: 'none',
                fillColor: fillColor,
                fillOpacity: 0.25,
                radius: Math.abs(row.change_total_dead_per_100k) * 50000,
                pane: pane
            }).addTo(map)
            .bindTooltip(
                `<strong>City:</strong> ${row.city}<br>` +
                `<strong>2020 vehicle accident deaths:</strong> ${row.total_deaths_2020}<br>` +
                `<strong>Change in vehicle accident death rate per 100k people, 2010-2020:</strong> ${changePercent}`
            );
        });
    }
});
