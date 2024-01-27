// Width and height for the SVG
const width = 960, height = 600;

// Select the SVG element and set attributes
const svg = d3.select("svg").attr("width", width).attr("height", height);

// Define the projection type
const projection = d3.geoNaturalEarth1().scale(width / 2 / Math.PI).translate([width / 2, height / 2]);

// Create a path generator using the projection
const path = d3.geoPath().projection(projection);

// Load the GeoJSON data and render the map
d3.json("test.json").then(data => {
    svg.selectAll(".country")
        .data(data.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path);
});
