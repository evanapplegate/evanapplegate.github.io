function pyramidBuilder(data, target, options) {
    var parentWidth = d3.select(target).node().getBoundingClientRect().width;
    var w = parentWidth * 0.9,
        h = typeof options.height === 'undefined' ? 400 : options.height,
        w_full = w,
        h_full = h;

    var margin = {
        top: 50,
        right: 10,
        bottom: 20,
        left: 10,
        middle: 20
    };

    var sectorWidth = (w / 2) - margin.middle,
        leftBegin = sectorWidth - margin.left,
        rightBegin = w - margin.right - sectorWidth;

    w = (w - (margin.left + margin.right));
    h = (h - (margin.top + margin.bottom));

    if (typeof options.style === 'undefined') {
        var style = {
            leftBarColor: '#6c9dc6',
            rightBarColor: '#de5454',
            tooltipBG: '#fefefe',
            tooltipColor: 'black'
        };
    } else {
        var style = {
            leftBarColor: typeof options.style.leftBarColor === 'undefined' ? '#6c9dc6' : options.style.leftBarColor,
            rightBarColor: typeof options.style.rightBarColor === 'undefined' ? '#de5454' : options.style.rightBarColor,
            tooltipBG: typeof options.style.tooltipBG === 'undefined' ? '#fefefe' : options.style.tooltipBG,
            tooltipColor: typeof options.style.tooltipColor === 'undefined' ? 'black' : options.style.tooltipColor
        };
    }

    var floridaTotal = d3.sum(data, function(d) {
        return d.Florida;
    });

    var usTotal = d3.sum(data, function(d) {
        return d.US;
    });

    var floridaPercentage = function(d) {
        return d.Florida / floridaTotal;
    };

    var usPercentage = function(d) {
        return d.US / usTotal;
    };

    var totalPopulation = floridaTotal + usTotal;

    var percentage = function(d) {
        return d / totalPopulation;
    };

    var styleSection = d3.select(target).append('style')
        .text('svg {max-width:100%} \
    .axis line,axis path {shape-rendering: crispEdges;fill: transparent;stroke: #555;} \
    .axis text {font-size: 11px;} \
    .bar {fill-opacity: 0.5;} \
    .bar.left {fill: ' + style.leftBarColor + ';} \
    .bar.left:hover {fill: ' + colorTransform(style.leftBarColor, '333333') + ';} \
    .bar.right {fill: ' + style.rightBarColor + ';} \
    .bar.right:hover {fill: ' + colorTransform(style.rightBarColor, '333333') + ';} \
    .tooltip {position: absolute;line-height: 1.1em;padding: 7px; margin: 3px;background: ' + style.tooltipBG + '; color: ' + style.tooltipColor + '; pointer-events: none;border-radius: 6px;}');

    var region = d3.select(target).append('svg')
        .attr('width', '100%')
        .attr('height', h_full);

    var legend = region.append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('class', 'bar left')
        .attr('x', (w / 2) - (margin.middle * 3))
        .attr('y', 12)
        .attr('width', 12)
        .attr('height', 12);

    legend.append('text')
        .attr('fill', '#000')
        .attr('x', (w / 2) - (margin.middle * 2))
        .attr('y', 18)
        .attr('dy', '0.32em')
        .text('Florida');

    legend.append('rect')
        .attr('class', 'bar right')
        .attr('x', (w / 2) + (margin.middle * 2))
        .attr('y', 12)
        .attr('width', 12)
        .attr('height', 12);

    legend.append('text')
        .attr('fill', '#000')
        .attr('x', (w / 2) + (margin.middle * 3))
        .attr('y', 18)
        .attr('dy', '0.32em')
        .text('U.S.');

    var tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var pyramid = region.append('g')
        .attr('class', 'inner-region')
        .attr('transform', translation(margin.left, margin.top));

    var maxValue = Math.ceil(Math.max(
        d3.max(data, function(d) {
            return percentage(d.Florida);
        }),
        d3.max(data, function(d) {
            return percentage(d.US);
        })
    ) / 0.05) * 0.05;

    var xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, (sectorWidth - margin.middle)])
        .nice();

    var xScaleLeft = d3.scaleLinear()
        .domain([0, maxValue])
        .range([sectorWidth, 0]);

    var xScaleRight = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, sectorWidth]);

    var yScale = d3.scaleBand()
        .domain(data.map(function(d) {
            return d.age;
        }))
        .range([h, 0], 0.1);

    var yAxisLeft = d3.axisRight()
        .scale(yScale)
        .tickSize(4, 0)
        .tickPadding(margin.middle - 4);

    var yAxisRight = d3.axisLeft()
        .scale(yScale)
        .tickSize(4, 0)
        .tickFormat('');

    var xAxisRight = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format('.0%'));

    var xAxisLeft = d3.axisBottom()
        .scale(xScale.copy().range([leftBegin, 0]))
        .tickFormat(d3.format('.0%'));

    var leftBarGroup = pyramid.append('g')
        .attr('transform', translation(leftBegin, 0) + 'scale(-1,1)');
    var rightBarGroup = pyramid.append('g')
        .attr('transform', translation(rightBegin, 0));

    pyramid.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(leftBegin, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    pyramid.append('g')
        .attr('class', 'axis y right')
        .attr('transform', translation(rightBegin, 0))
        .call(yAxisRight);

    pyramid.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, h))
        .call(xAxisLeft);

    pyramid.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(rightBegin, h))
        .call(xAxisRight);

    leftBarGroup.selectAll('.bar.left')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('x', 0)
        .attr('y', function(d) {
            return yScale(d.age) + margin.middle / 4;
        })
        .attr('width', function(d) {
            return xScale(floridaPercentage(d));
        })
        .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
        .on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltipDiv.html("<strong>Florida Age " + d.age + "</strong>" +
                    "<br />  Population: " + prettyFormat(d.Florida) +
                    "<br />" + (Math.round(floridaPercentage(d) * 1000) / 10) + "% of Total")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });

    rightBarGroup.selectAll('.bar.right')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('x', 0)
        .attr('y', function(d) {
            return yScale(d.age) + margin.middle / 4;
        })
        .attr('width', function(d) {
            return xScale(usPercentage(d));
        })
        .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
        .on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltipDiv.html("<strong> U.S. Age " + d.age + "</strong>" +
                    "<br />  Population: " + prettyFormat(d.US) +
                    "<br />" + (Math.round(usPercentage(d) * 1000) / 10) + "% of Total")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        });

    function resizeChart() {
        parentWidth = d3.select(target).node().getBoundingClientRect().width;
        w = parentWidth * 0.9;
        region.attr('width', '100%')
            .attr('height', h_full);

        sectorWidth = (w / 2) - margin.middle;
        leftBegin = sectorWidth - margin.left;
        rightBegin = w - margin.right - sectorWidth;
        w = (w - (margin.left + margin.right));

        xScale.range([0, sectorWidth - margin.middle]);
        xScaleLeft.range([sectorWidth, 0]);
        xScaleRight.range([0, sectorWidth]);

        leftBarGroup.attr('transform', translation(leftBegin, 0) + 'scale(-1,1)');
        rightBarGroup.attr('transform', translation(rightBegin, 0));

        pyramid.select('.axis.y.left')
            .attr('transform', translation(leftBegin, 0))
            .call(yAxisLeft)
            .selectAll('text')
            .style('text-anchor', 'middle');

        pyramid.select('.axis.y.right')
            .attr('transform', translation(rightBegin, 0))
            .call(yAxisRight);

        pyramid.select('.axis.x.left')
            .attr('transform', translation(0, h))
            .call(xAxisLeft);

        pyramid.select('.axis.x.right')
            .attr('transform', translation(rightBegin, h))
            .call(xAxisRight);

        leftBarGroup.selectAll('.bar.left')
            .attr('width', function(d) {
                return xScale(floridaPercentage(d));
            });

        rightBarGroup.selectAll('.bar.right')
            .attr('width', function(d) {
                return xScale(usPercentage(d));
            });
    }

    window.addEventListener('resize', resizeChart);

    resizeChart();

    function translation(x, y) {
        return 'translate(' + x + ',' + y + ')';
    }

    function prettyFormat(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function colorTransform(c1, c2) {
        var c1 = c1.replace('#', ''),
            origHex = {
                r: c1.substring(0, 2),
                g: c1.substring(2, 4),
                b: c1.substring(4, 6)
            },
            transVec = {
                r: c2.substring(0, 2),
                g: c2.substring(2, 4),
                b: c2.substring(4, 6)
            },
            newHex = {};

        function transform(d, e) {
            var f = parseInt(d, 16) + parseInt(e, 16);
            if (f > 255) {
                f = 255;
            }
            return f.toString(16);
        }
        newHex.r = transform(origHex.r, transVec.r);
        newHex.g = transform(origHex.g, transVec.g);
        newHex.b = transform(origHex.b, transVec.b);
        return '#' + newHex.r + newHex.g + newHex.b;
    }
}