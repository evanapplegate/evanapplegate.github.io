const margin = { top: 10, right: 50, bottom: 10, left: 0 };
const width = 600 - margin.left - margin.right;
const height = 4000 - margin.top - margin.bottom;

// Append an SVG element to the chart div
const svg = d3.select("#city_accident_chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

// Load the CSV data
d3.csv("https://raw.githubusercontent.com/evanapplegate/evanapplegate.github.io/main/accidents_by_city/table_124_NHTSA.csv").then(data => {
  // Parse numeric values
  data.forEach(d => {
    d.auto_deaths_2020 = +d.auto_deaths_2020;
    d.ped_deaths_2020 = +d.ped_deaths_2020;
  });

  // Create a scale for the x-axis
  const xScale = d3.scaleLinear()
    .domain([0, 300])
    .range([0, width]);

  // Create a scale for the y-axis
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.city))
    .range([0, height])
    .padding(0.2);

  // Create the blue bars for auto deaths
  svg.selectAll(".auto-bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "auto-bar")
    .attr("x", margin.left)
    .attr("y", d => yScale(d.city))
    .attr("width", d => xScale(d.auto_deaths_2020))
    .attr("height", yScale.bandwidth() / 2)
    .attr("fill", "blue");

  // Create the red bars for pedestrian deaths
  svg.selectAll(".ped-bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "ped-bar")
    .attr("x", margin.left)
    .attr("y", d => yScale(d.city) + yScale.bandwidth() / 2)
    .attr("width", d => xScale(d.ped_deaths_2020))
    .attr("height", yScale.bandwidth() / 2)
    .attr("fill", "red");

  // Add labels for each pair of bars
  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", margin.left + 50)
    .attr("y", d => yScale(d.city) + yScale.bandwidth() / 2 + 5)
    .attr("text-anchor", "end")
    .text(d => d.city)
    .attr("font-size", 10);

  // Add x-axis ticks at the bottom
  const xAxisBottom = d3.axisBottom(xScale)
    .tickValues([0, 50, 100, 150, 200, 250, 300])
    .tickSize(2);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisBottom);

  // Add x-axis ticks at the top
  const xAxisTop = d3.axisTop(xScale)
    .tickValues([0, 50, 100, 150, 200, 250, 300])
    .tickSize(2);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${margin.top})`)
    .call(xAxisTop);
});
