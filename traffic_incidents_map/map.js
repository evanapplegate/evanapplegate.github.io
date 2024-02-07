var map = L.map('map').setView([39.5530, -111.0937], 7); // Centered on Utah

L.tileLayer('https://api.mapbox.com/styles/v1/evandapplegate/clsbanwr802ro01qqf0du3pko/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var incidentMarkers = {};

// Function to check if incident is within the last 24 hours
function isRecent(incidentTime) {
    const incidentDate = moment(incidentTime, "M/D/YY, h:mm A");
    const twentyFourHoursAgo = moment().subtract(24, 'hours');
    return incidentDate.isAfter(twentyFourHoursAgo);
}

Papa.parse("incidents.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        results.data.forEach(function(incident) {
            if (incident.latitude && incident.longitude && isRecent(incident.startTime)) {
                var descriptionFirstLine = incident.description.split('\n')[0]; // Get first line of description
                var marker = L.circleMarker([incident.latitude, incident.longitude], {
                    radius: 5,
                    fillColor: '#fa9900',
                    fillOpacity: 0.5,
                    color: '#ff6c00',
                    weight: 1,
                    opacity: .7 // Changed opacity to make stroke visible
                });

                // Bind tooltip
                marker.bindTooltip(
                    'Location: ' + incident.location + '<br>' +
                    'Start Time: ' + incident.startTime + '<br>' +
                    'Anticipated End Time: ' + incident.anticipatedEndTime + '<br>' +
                    'Description: ' + descriptionFirstLine, {
                        permanent: false, // Tooltip will only show on hover
                        direction: 'auto' // Automatically positions the tooltip
                    }
                );

                // Add marker to array indexed by incident type
                var type = incident.type || 'Other'; // Default to 'Other' if type is undefined
                if (!incidentMarkers[type]) incidentMarkers[type] = [];
                incidentMarkers[type].push(marker);
                marker.addTo(map); // Add marker to map immediately
            }
        });
    }
});

