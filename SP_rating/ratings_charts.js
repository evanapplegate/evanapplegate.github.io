(function() {
    // Parse the date / time
    var parseDate = d3.timeParse("%b. %d, %Y");

    // Set the dimensions of each chart
    var margin = {top: 20, right: 30, bottom: 20, left: 30},
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
            // Scale data
            x.domain(d3.extent(countryData, function(d) { return d.date; }));

            // Append svg 
            var svg = d3.select("#charts-container").append("svg")
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                .attr("class", "chart")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Add line chart
            svg.append("path")
                .datum(countryData)
                .attr("class", "line")
                .attr("d", valueline)
                .attr("fill", "none")
                .attr("stroke", "#FEFAF6")
                .attr("stroke-width", "2");

            // x axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickValues([x.domain()[0], x.domain()[1]]).tickFormat(d3.timeFormat("%Y")))
                .selectAll("text")
                .attr("font-size", "8px")
                .attr("fill", "#5b4c87");

            // ticks
            svg.selectAll(".tick line")
                .attr("stroke", "#5b4c87")
                .attr("y2", -height);

            // terminal dot
            svg.append("circle")
                .attr("cx", x(countryData[countryData.length - 1].date))
                .attr("cy", y(countryData[countryData.length - 1].rating_value))
                .attr("r", 3)
                .attr("fill", "#FEFAF6");

            // label last rating
            var latestDataPoint = countryData[countryData.length - 1];
            svg.append("text")
                .attr("x", x(latestDataPoint.date) + 2) 
                .attr("y", y(latestDataPoint.rating_value))
                .attr("dy", "-0.5em") 
                .attr("class", "label")
                .attr("font-size", "8px")
                .attr("fill", "#FEFAF6")
                .text(latestDataPoint.LT_foreign_currency_rating);

            // remove X axis line
            svg.selectAll(".domain").remove();

            // add title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .attr("class", "chart-title")
                .attr("text-anchor", "middle")
                .attr("font-size", "8px")
                .attr("fill", "#FEFAF6")
                .text(key);
        });
    });
})();
