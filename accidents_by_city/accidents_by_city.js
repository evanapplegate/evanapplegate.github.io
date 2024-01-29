let map = L.map('accident_cities').setView([38.5, -98.0], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/evandapplegate/ckljyc21f1de617qmasjc1ybf/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw', {
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
        let paneData = [[], [], []];

        // Separate the data into their respective pane groups
        results.data.forEach(function(row) {
            let index;
            if (row.city_pop_2020 < 500000) {
                index = 0;
            } else if (row.city_pop_2020 <= 1000000) {
                index = 1;
            } else {
                index = 2;
            }
            paneData[index].push(row);
        });

        // Sort the data in each pane group in descending order
        paneData.forEach(function(data, i) {
            data.sort((a, b) => Math.abs(b.change_total_dead_per_100k) - Math.abs(a.change_total_dead_per_100k));

            // Add circles to the map
            data.forEach(function(row) {
                let fillColor;
                if (row.change_total_dead_per_100k >= 0.51) {
                    fillColor = '#ce572b';
                } else if (row.change_total_dead_per_100k >= 0.26) {
                    fillColor = '#e9865b';
                } else if (row.change_total_dead_per_100k >= 0.01) {
                    fillColor = '#f5d0bf';
                } else {
                    fillColor = '#6c88ce';
                }

                let radius = Math.sqrt(Math.abs(row.change_total_dead_per_100k) * 10000000000);

                let changePercent = (row.change_total_dead_per_100k >= 0) ? '+' : '';
                changePercent += Math.round(row.change_total_dead_per_100k * 100) + '%';


                L.circle([row.latitude, row.longitude], {
                    color: fillColor,
                    fillColor: fillColor,
                    fillOpacity: 0.25,
                    weight: 0.5,
                    opacity: 0.5,
                    radius: radius,
                    pane: panes[i]
                }).addTo(map)
                .bindTooltip(
                    `<strong>${row.city}</strong> <br>` +
                    `2020 vehicle accident deaths:<strong> ${row.total_deaths_2020}</strong> <br>` +
                    `Change in accident death rate, 2010-2020: <strong>${changePercent}</strong>`
                );
            });
        });
    }
});
