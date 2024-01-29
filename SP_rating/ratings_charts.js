(function() {
    // Parse the date / time
    var parseDate = d3.timeParse("%b. %d, %Y");

    // Set the dimensions of each chart
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 200 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().domain([0, 20]).range([height, 0]);

    // Define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rating_value); });

    // Get the data
    d3.csv("data.csv").then(function(data) {
        // Format the data and sort by date
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.rating_value = +d.rating_value;
        });
        data.sort(function(a, b) { return a.date - b.date; });

        // Nest the entries by country_name
        var dataNest = d3.group(data, function(d) { return d.country_name; });

        dataNest.forEach(function(countryData, key) {
            // Scale the range of the data for the x-axis
            x.domain(d3.extent(countryData, function(d) { return d.date; }));

            // Append the svg object to the div with id 'charts-container'
            var svg = d3.select("#charts-container").append("svg")
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                .attr("class", "chart")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Add the valueline path
            svg.append("path")
                .datum(countryData) // Bind data to the line
                .attr("class", "line")
                .attr("d", valueline)
                .attr("fill", "none")
                .attr("stroke", "#6e5950")
                .attr("stroke-width", "2");

            // Add the X Axis with only the beginning and ending values
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickValues([x.domain()[0], x.domain()[1]]).tickFormat(d3.timeFormat("%Y")))
                .selectAll("text")
                .attr("font-size", "8px")
                .attr("fill", "#6e5950");

            // Customize the tick lines
            svg.selectAll(".tick line")
                .attr("stroke", "#f1ebe5")
                .attr("y2", -height); // Extend the ticks up towards the line

            // Add the dot at the end of each line
            svg.append("circle")
                .attr("cx", x(countryData[countryData.length - 1].date))
                .attr("cy", y(countryData[countryData.length - 1].rating_value))
                .attr("r", 3)
                .attr("fill", "#6e5950");

            // Add the label for the latest date and rating
            var latestDataPoint = countryData[countryData.length - 1];
            svg.append("text")
                .attr("x", x(latestDataPoint.date) - 8) // Adjust the position to the right of the dot
                .attr("y", y(latestDataPoint.rating_value))
                .attr("dy", "-0.5em") // Adjust vertical alignment
                .attr("class", "label")
                .attr("font-size", "8px")
                .attr("fill", "#6e5950")
                .text(latestDataPoint.LT_foreign_currency_rating);

            // Remove the horizontal line from the X Axis
            svg.selectAll(".domain").remove();

            // Add the title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .attr("class", "chart-title")
                .attr("text-anchor", "middle") // Center the title
                .attr("font-size", "8px")
                .attr("fill", "#6e5950")
                .text(key);
        });
    });
})();
