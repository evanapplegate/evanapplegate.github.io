// Set up the SVG container
const svg = d3.select("#state-map")
  .append("svg")
  .attr("width", 975)
  .attr("height", 400);

// Set up the tooltip
const tooltip = d3.select("#state-map")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load the data
Promise.all([
  d3.json("https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/states-albers-10m.json"),
  d3.csv("https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/vehicle_deaths_per_miles.csv")
]).then(function ([topology, data]) {
  // Prepare the data
  const stateData = {};
  data.forEach(function (d) {
    stateData[d.state] = +d.change;
  });

  // Convert the TopoJSON to GeoJSON
  const geojson = topojson.feature(topology, topology.objects.states);

  // Join the data
  geojson.features.forEach(function (feature) {
    feature.properties.change = stateData[feature.properties.name] || 0;
  });

  // Set up the color scale
  const colorScale = d3.scaleQuantile()
    .domain(d3.extent(geojson.features, function (d) { return d.properties.change; }))
    .range(["#FFC0CB", "#FF69B4", "#FF1493", "#8B0000"]);

  // Draw the map
  svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .style("fill", function (d) { return colorScale(d.properties.change); })
    .on("mouseover", function (event, d) {
      const percentage = Math.round(d.properties.change * 100);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(d.properties.name + ": " + (percentage > 0 ? "+" : "") + percentage + "%")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Add legend manually
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 20)");

  const legendColors = ["#FFC0CB", "#FF69B4", "#FF1493", "#8B0000"];
  const legendText = ["< 25%", "25% - 50%", "50% - 75%", "> 75%"];

  const legendItem = legend.selectAll(".legend-item")
    .data(legendColors)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", function (d, i) { return "translate(0," + (i * 20) + ")"; });

  legendItem.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d) { return d; });

  legendItem.append("text")
    .attr("x", 24)
    .attr("y", 14)
    .text(function (d, i) { return legendText[i]; });

}).catch(function (error) {
  console.log(error);
});
