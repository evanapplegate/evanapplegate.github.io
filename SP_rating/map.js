// SVG width, height
const width = 960, height = 600;

// SVG element + attributes
const svg = d3.select("svg").attr("width", width).attr("height", height);

// projection type
const projection = d3.geoNaturalEarth1().scale(width / 2 / Math.PI).translate([width / 2, height / 2]);

// projection
const path = d3.geoPath().projection(projection);

// color scale for different ratings
const ratingColors = {
    "AAA": "#440154",
    "AA+": "#481a6c",
    "AA": "#472f7d",
    "A+": "#414487",
    "A": "#39568c",
    "A-": "#31688e",
    "BBB+": "#2a788e",
    "BBB": "#23888e",
    "BBB-": "#219097",
    "BB+": "#1f988b",
    "BB": "#22a884",
    "BB-": "#28ae80",
    "B+": "#35b779",
    "B": "#54c568",
    "B-": "#7ad151",
    "CCC+": "#a5db36",
    "CCC": "#d2e21b",
    "CCC-": "#e0e21b",
    "SD/D": "#fde725"
};

// Load countries
d3.json("hex_world_map_v2.geojson").then(data => {
    svg.selectAll(".country")
        .data(data.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .style("fill", d => ratingColors[d.properties.mapped_ratings_sovereign_foreign_currency_rating_nov_2023]) // Set color based on rating
        .on("mouseover", function(event, d) {
    // Check if the country has a current rating
    if (d.properties.mapped_ratings_sovereign_foreign_currency_rating_nov_2023 !== null && d.properties.mapped_ratings_sovereign_foreign_currency_rating_nov_2023 !== undefined) {
        // Show the tooltip
        d3.select("#tooltip")
            .style("display", "inline")
            .html(`${d.properties.mapped_ratings_country}<br>Rating: ${d.properties.mapped_ratings_sovereign_foreign_currency_rating_nov_2023}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
                }
            })
            .on("mouseout", function() {
                // Hide the tooltip on mouseout
                d3.select("#tooltip").style("display", "none");
            });

            // Load borders
d3.json("borders.json").then(bordersData => {
    svg.selectAll(".border")
        .data(bordersData.features)
        .enter().append("path")
        .attr("class", "border")
        .attr("d", path) // map projection
        .style("fill", "none") 
        .style("stroke", "#FEFAF6") 
        .style("stroke-width", "0.5px"); 
});


});
