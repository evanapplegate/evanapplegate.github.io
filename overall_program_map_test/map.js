const width = 960;
const height = 600;

const projection = d3.geoCylindricalStereographic()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const svg = d3.select("#map")
    .attr("viewBox", `0 0 ${width} ${height}`);

const tooltip = d3.select("#tooltip");
const clickTooltip = d3.select("#click-tooltip");

const colorScale = d3.scaleOrdinal()
    .domain(["publichealth", "gov", "founders", "associates", "env", "education", "arts"])
    .range(["#F6A229", "#45C1C0", "#AC4399", "#E56722", "#6EBE4A", "#004685", "#D8365B"]);

let activeProgram = "all"; // Variable to track the currently selected program

const imageCaptions = {
    "gov_brazil.jpg": "Government Innovation: The success of São Paulo's winning idea in the 2016 Mayors Challenge, which connected farmers with local markets to grow their earnings and improve sustainability, has spurred 77 cities to replicate the program.",
    "env_india.jpg": "Environment: In addition to supporting India's national clean air plan, we also supported a project in Mumbai that tested 40 low-cost sensors alongside proven monitors to measure their effectiveness for scaling nationwide.",
    "associates_milan.jpg": "Associates: Our experts at Bloomberg Associates have worked with Milan to modernize its economic development strategy, create green public spaces and plazas, and make it easier for people to move to the city.",
    "health_MX.jpg": "Public Health: After 10 years of advocacy from our partners, Mexico became the latest country to ban smoking in indoor public places, with the aim to prevent more of the country's 63,000 annual deaths from tobacco.",
    "gov_isr.jpg": "Government Innovation: Building on our leadership training for mayors at Harvard University, we partnered on the Bloomberg-Sagol Center for City Leadership at Tel Aviv University, which trained its first class of 20 mayors and 40 senior staff in Israel in 2022.",
    "founders_rwanda.jpg": "Founder's Projects: At the 2022 Heads of Commonwealth meeting, women's economic development programs we support were featured and presented to the first ladies of 50 Commonwealth countries as models to be replicated in their own countries.",
    "arts_london.jpg": "Arts: The Serpentine, a longtime cultural partner that Mike also chairs, unveiled its Serpentine Pavilion 2022: Black Chapel by Theaster Gates. The institution is one of over 200 globally with a free guide on our Bloomberg Connects app.",
    "health_tanzania.jpg": "Public Health: We worked with Tanzania to improve birth and death data collection, training community health workers to gather data on rural deaths and advocating for waived fees for birth and death registrations.",
    "founders_atl.jpg": "Founder's Projects: Morehouse School of Medicine is one of four historically Black medical schools that we supported with scholarships to reduce student debt and increase the number of Black doctors. Nearly 450 students in the program have now graduated, including over 100 from Morehouse.",
    "arts_denver.jpg": "Arts: Denver is one of more than 60 cities where we supported asphalt art projects to enliven streets and improve safety. The city transformed an intersection at the heart of one of its oldest neighborhoods.",
    "education_DC.jpg": "Education: D.C. charter schools that we have supported are set to open more than 4.000 new seats in the coming years, as part of our national effort to create 150,000 new charter seats by 2026.",
    "education_NYC.jpg": "Our summer learning program in New York City, called Summer Boost, reached more than 16,000 K-8 charter school students, and its success led us to expand it to seven more cities in 2023.",
    "env_MN.jpg": "Environment: We helped close 12 of the state's 15 coal plants, including one that will now become one of the world's largest battery storage sites. We have retired 70% of plants nationwide."
};

// Load all GeoJSON files simultaneously and wait for all to finish
Promise.all([
    d3.json("geodata/countries_with_names_topo.json"), // Load TopoJSON
    d3.json("geodata/borders.geojson"), // Load borders GeoJSON
    d3.json("geodata/hexes_with_programs.geojson"),
    d3.json("geodata/highlights.geojson") // Load highlights GeoJSON
]).then(([topoCountries, borders, hexesWithPrograms, highlights]) => {
    // Existing code to add countries, borders, and hexes_with_programs layers...
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


// Add the highlights layer with specific styling and interactions
svg.selectAll(".highlight")
    .data(highlights.features)
    .enter().append("path")
    .attr("class", "highlight")
    .attr("d", path)
    .attr("fill", d => colorScale(d.properties.main_program))
    // .attr("stroke", "#FEF9F5")
    // .attr("stroke-width", 1)
    .each(function(d) {
        const centroid = path.centroid(d);
        d3.select(this)
          .attr("transform", `translate(${centroid}) scale(5) translate(${-centroid[0]},${-centroid[1]})`).attr("stroke", "#FEF9F5").attr("stroke-width", .2);
    })
    .on("mouseover", function(event, d) {
        d3.select(this).transition()  // Use transition for smooth scaling
          .attr("transform", function(d) {
              const centroid = path.centroid(d);
              return `translate(${centroid}) scale(8) translate(${-centroid[0]},${-centroid[1]})`;
          })
          .attr("stroke-width", .2);
    })
    .on("mouseout", function(event, d) {
        d3.select(this).transition()  // Use transition for smooth scaling
          .attr("transform", function(d) {
              const centroid = path.centroid(d);
              return `translate(${centroid}) scale(5) translate(${-centroid[0]},${-centroid[1]})`;
          })
          .attr("stroke-width", 0.2);
    })
    .on("click", function(event, d) {
        const [x, y] = d3.pointer(event);
        clickTooltip.style("left", `${x}px`)
            .style("top", `${y}px`)
            .html(`<img src="images/${d.properties.image}" alt="${d.properties.image}"><p>${imageCaptions[d.properties.image]}</p>`)
            .style("display", "block");
    });


});


// Close any open click tooltips when clicking anywhere on the map
svg.on("click", function(event) {
    // Check if the click was not on a path element
    if (event.target.tagName !== 'path') {
        clickTooltip.style("display", "none");
    }
});
