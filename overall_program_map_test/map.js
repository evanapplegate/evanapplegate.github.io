const width = 960;
const height = 600;

const projection = d3.geoCylindricalStereographic()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// const svg = d3.select("#map")
//     .attr("width", width)
//     .attr("height", height);

    const svg = d3.select("#map")
    .attr("viewBox", `0 0 ${width} ${height}`);

const tooltip = d3.select("#tooltip");

d3.json("geodata/land.geojson").then(land => {
    svg.append("path")
        .datum(land)
        .attr("d", path)
        .attr("fill", "#F2EBE4");
});


const colorScale = d3.scaleOrdinal()
    .domain(["publichealth", "gov", "founders", "associates", "env", "education", "arts"])
    .range(["#45C1C0", "#45C1C0", "#AC4399", "#E56722", "#6EBE4A", "#004685", "#D8365B"]);

d3.json("geodata/hexes_with_programs.geojson").then(data => {
    svg.selectAll(".hex")
        .data(data.features)
        .enter().append("path")
        .attr("class", "hex")
        .attr("d", path)
        .attr("fill", d => colorScale(d.properties.main_program))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", d3.select(this).attr("fill"));
            let tooltipHtml = `${d.properties.country}<br>`;
            ["arts", "associates", "education", "env", "founders", "gov", "publichealth"].forEach(field => {
                if (d.properties[field] !== 0) {
                    let fieldName = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize the first letter
                    if (field === "arts") fieldName = "Arts";
                    if (field === "associates") fieldName = "Bloomberg Associates";
                    if (field === "education") fieldName = "Education";
                    if (field === "env") fieldName = "Environment";
                    if (field === "founders") fieldName = "Founder’s projects";
                    if (field === "gov") fieldName = "Government Innovation";
                    if (field === "publichealth") fieldName = "Public Health";
                    tooltipHtml += `${fieldName}: ${d.properties[field]}<br>`;
                }
            });
            tooltip.html(tooltipHtml)
                .style("display", "block")
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "none");
            tooltip.style("display", "none");
    
    });
})

// borders
    d3.json("geodata/borders.geojson").then(borders => { // borders
    svg.append("path")
        .datum(borders)
        .attr("d", path)
        .style("fill", "none") 
        .style("stroke", "#FDF8F4") 
        .style("stroke-width", "0.5px"); 
        // .attr("stroke", "#FDF8F4")
        // .attr("stroke-width", 0.5)
        // .attr("fill", "none");
        });