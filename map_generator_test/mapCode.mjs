import { promises as fs } from 'fs';
import { JSDOM } from 'jsdom';
import * as d3 from 'd3';

(async () => {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  const body = d3.select(dom.window.document.querySelector("body"));
  const svg = body.append("svg").attr("xmlns", "http://www.w3.org/2000/svg");

  const width = 960;
  const height = 600;

  svg.attr("width", width).attr("height", height);

  const projection = d3.geoAlbersUsa().scale(1300).translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  const data = await fs.readFile('./US_states.geojson', 'utf8');
  const statesData = JSON.parse(data);

  svg.selectAll("path")
    .data(statesData.features)
    .enter().append("path")
    .attr("d", path)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .attr("fill", d => {
      if (["AL", "MN", "NM"].includes(d.properties.postal)) return "red";
      if (["NY", "OR"].includes(d.properties.postal)) return "blue";
      return "lightgrey";
    });

  svg.selectAll("text")
    .data(statesData.features)
    .enter().append("text")
    .attr("transform", d => `translate(${path.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("fill", "black")
    .text(d => d.properties.postal);

  const serializer = new XMLSerializer();
  const string = serializer.serializeToString(dom.window.document);
  await fs.writeFile('your_map.svg', string);
})();