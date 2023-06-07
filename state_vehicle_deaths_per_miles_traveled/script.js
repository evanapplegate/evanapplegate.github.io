// Set up the SVG container
const svg = d3.select("#state-map")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 800 400");

// Set up the tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load the data
Promise.all([
  d3.json("https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/states-10m.json"),
  d3.csv("https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/vehicle_deaths_per_miles.csv")
]).then(function ([topology, data]) {
  // Prepare the data
  const stateData = {};
  data.forEach(function (d) {
    stateData[d.state] = {
      change: +d.change,
      rate2010: +d["2010_rate_per_100m_vehicle_miles_traveled"],
      rate2020: +d["2020_rate_per_100m_vehicle_miles_traveled"]
    };
  });

  // Convert the TopoJSON to GeoJSON
  const geojson = topojson.feature(topology, topology.objects.states);

  // Set up the projection
  const projection = d3.geoAlbersUsa()
    .fitSize([800, 400], geojson);

  // Set up the path generator
  const path = d3.geoPath().projection(projection);

  // Join the data
  geojson.features.forEach(function (feature) {
    const state = feature.properties.name;
    feature.properties.change = stateData[state]?.change || 0;
    feature.properties.rate2010 = stateData[state]?.rate2010 || 0;
    feature.properties.rate2020 = stateData[state]?.rate2020 || 0;
  });

  // Set up the color scale
  const colorScale = d3.scaleThreshold()
    .domain([-0.01, 0, 0.25, 0.5])
    .range(["#b1bddb", "#f5d0bf", "#e9865b", "#ce572b"]);

  // Draw the map
  svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function (d) { return colorScale(d.properties.change); })
    .style("stroke", "#fff")
    .style("stroke-width", "0.5px")
    .on("mouseover", function (event, d) {
      const percentage = Math.round(d.properties.change * 100);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(
        "<strong>" + d.properties.name + "</strong><br/>" +
        "Change: " + (percentage >= 0 ? "+" : "") + percentage + "%<br/>" +
        "2010 Rate: " + d.properties.rate2010.toFixed(2) + " deaths per 100m vehicle miles<br/>" +
        "2020 Rate: " + d.properties.rate2020.toFixed(2) + " deaths per 100m vehicle miles"
      )
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(500).style("opacity", 0);
    });

}).catch(function (error) {
  console.log(error);
});
