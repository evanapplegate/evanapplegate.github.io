const width = 960;
const height = 600;

const projection = d3.geoCylindricalStereographic()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const svg = d3.select("#map")
    .attr("viewBox", `0 0 ${width} ${height}`);

const tooltip = d3.select("#tooltip");

const colorScale = d3.scaleOrdinal()
    .domain(["publichealth", "gov", "founders", "associates", "env", "education", "arts"])
    .range(["#F6A229", "#45C1C0", "#AC4399", "#E56722", "#6EBE4A", "#004685", "#D8365B"]);

let activeProgram = "all"; // Variable to track the currently selected program

// Load all GeoJSON files simultaneously and wait for all to finish
Promise.all([
    d3.json("geodata/countries_with_names_topo.json"), // Load TopoJSON
    d3.json("geodata/borders.geojson"), // Load borders GeoJSON
    d3.json("geodata/hexes_with_programs.geojson")
]).then(([topoCountries, borders, hexesWithPrograms]) => {
    // Convert TopoJSON to GeoJSON for the countries layer
    const countries = topojson.feature(topoCountries, topoCountries.objects.countries_with_names);

    // Add the countries layer and store a reference to it
    const countriesLayer = svg.selectAll(".country")
        .data(countries.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", "#F2EBE4");

    // Add the borders layer with specified stroke width and color
    svg.append("path")
        .datum(borders)
        .attr("d", path)
        .attr("stroke", "#FDF8F4")
        .attr("stroke-width", 0.5)
        .attr("fill", "none");

    // Define a mapping of program names to their respective colors
    const programColors = {
        'arts': '#D8365B',
        'associates': '#E56722',
        'education': '#004685',
        'env': '#6EBE4A',
        'founders': '#AC4399',
        'gov': '#45C1C0',
        'publichealth': '#F6A229'
    };

    // Button click event listener
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            activeProgram = this.getAttribute('data-program');
            svg.selectAll(".hex")
                .style('display', d => {
                    if (activeProgram === 'all') return null; // Show all polygons
                    return d.properties[activeProgram] > 0 ? null : 'none'; // Show/Hide based on the program
                })
                .attr("fill", d => {
                    if (activeProgram === 'all') {
                        return colorScale(d.properties.main_program); // Reset to default color scheme
                    } else {
                        return d.properties[activeProgram] > 0 ? programColors[activeProgram] : null; // Change color based on the button pressed
                    }
                });
        });
    });

    // Initially, simulate a click on "All Programs" button to show all polygons with default color scheme
    document.querySelector('.filter-btn[data-program="all"]').click();

    // Add the hexes with programs layer with updated tooltip logic and fill color change on mouseover
    svg.selectAll(".hex")
        .data(hexesWithPrograms.features)
        .enter().append("path")
        .attr("class", "hex")
        .attr("d", path)
        .attr("fill", d => colorScale(d.properties.main_program))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", d3.select(this).attr("fill"));

            // Change the fill color of the matching country polygon
            countriesLayer
                .filter(country => country.properties.Name === d.properties.country) // Ensure this matches your data
                .attr("fill", "#e9e0d7");

            let tooltipHtml = `${d.properties.country}<br>`;

            // Mapping of field names to their full, display-ready names
            const fieldNamesMap = {
                'arts': 'Arts',
                'associates': 'Bloomberg Associates',
                'education': 'Education',
                'env': 'Environment',
                'founders': 'Founder’s Projects',
                'gov': 'Government Innovation',
                'publichealth': 'Public Health'
            };

            if (activeProgram === 'all') {
                ["arts", "associates", "education", "env", "founders", "gov", "publichealth"].forEach(field => {
                    if (d.properties[field] !== 0) {
                        const fieldName = fieldNamesMap[field];
                        tooltipHtml += `${fieldName}: ${d.properties[field]}<br>`;
                    }
                });
            } else {
                const fieldName = fieldNamesMap[activeProgram];
                tooltipHtml += `${fieldName}: ${d.properties[activeProgram]}<br>`;
            }

            tooltip.html(tooltipHtml)
                .style("display", "block")
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "none");

            // Reset the fill color of all country polygons to the default
            countriesLayer.attr("fill", "#F2EBE4");

            tooltip.style("display", "none");
        });
});
