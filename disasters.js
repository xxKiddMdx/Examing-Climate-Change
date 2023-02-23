/* globals d3 */
d3.csv("disasters.csv", d3.autoType).then((data) => {
  console.log(data);
  console.log(data.columns.slice(1));
  const series = d3.stack().keys(data.columns.slice(1))(data);
  console.log(series);
  const margin = { top: 10, right: 200, bottom: 20, left: 40 };

  const width = 1400 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  let array = series.map((d) => d.key);

  const categories = new Set(array);

  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
    .rangeRound([0, width]); //set it to 2*width to make x-axis legible

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.Year))
    .range([height, 0])
    .padding(0.1);

  const color = d3
    .scaleOrdinal()
    .domain(series.map((d) => d.key))
    .range(d3.schemeSpectral[series.length])
    .unknown("#ccc");

  //   d3.scaleOrdinal(d3.schemeTableau10)
  //     .domain(series.map(d => d.key));
  /*
  var tooltip = d3
    .select(".tooltip_disasters")
    //set positions
    // format your tooltip

    .style("position", "absolute")
    .style("opacity", 0.8)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .html(data.key + ", " + data.Year);
    */

  svg
    .append("g")
    .attr("clip-path", "url(#clip-path)") //refer to the clip path
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("class", "bar")
    .attr("y", (d, i) => y(d.data.Year))
    .attr("x", (d) => x(d[0]))
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d[1]) - x(d[0]));
  /*
    .on("mouseenter", function (event, d) {
      console.log("i");
      const pos = d3.pointer(event, window);
      tooltip
        .html(d.data.key + ", " + d.data.Year)
        .style("left", pos[0] + "px")
        .style("top", pos[1] + "px")
        .style("display", "block");
    })
    .on("mouseleave", (event, d) => {
      return tooltip.style("display", "none");
    });
    */

  const yAxis = d3.axisLeft(y);
  svg.append("g").attr("class", "y-axis").call(yAxis);

  const xAxis = d3.axisBottom(x).ticks(null, "s");

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("clip-path", "url(#clip-path)") // apply the clip path to x-axis
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  
  svg
    .append("text")
    .attr("x", 35)
    .attr("y", 0)
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "top")
    .text("Year");
  
    svg
    .append("text")
    .attr("x", width)
    .attr("y", height-5)
    .attr("text-anchor", "end")
    .attr("alignment-baseline", "top")
    .text("Occurrences");

  // // clippath
  const clip = svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip-path")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  //  Zoom-related code
  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .translateExtent([
      [0, 0],
      [2 * width, height],
    ])
    .scaleExtent([1, 4])
    .on("zoom", zoomed);

  svg
    .append("g")
    .append("rect")
    .attr("class", "zoom-area")
    .style("pointer-events", "all")
    .attr("opacity", 0)
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

  const legend = svg
    .selectAll(".chart")
    .data(categories)
    .enter()
    .append("rect")
    .attr("height", 20)
    .attr("width", 20)
    .attr("stroke", "black")
    .attr("y", function (d, i) {
      return i * 30;
    })
    .attr("x", width + 10)
    .attr("fill", function (d) {
      return color(d);
    });

  svg
    .selectAll(".chart")
    .data(categories)
    .enter()
    .append("text")
    .attr("class", "legendtext")
    .attr("x", width + 35)
    .attr("y", function (d, i) {
      return 11 + i * 30;
    })
    .attr("alignment-baseline", "middle")
    .text((d) => d)
    .attr("font-size", 14);

  function zoomed(event) {
    // computing a new range for y-scale
    y.range([height, 0].map((d) => event.transform.applyY(d)));
    // updating positions of the bars
    svg
      .selectAll(".bar")
      .attr("y", (d, i) => y(d.data.Year))
      .attr("height", y.bandwidth());

    svg.select(".y-axis").call(yAxis);
  }
});

// References
// https://observablehq.com/@d3/stacked-bar-chart
// https://observablehq.com/@d3/zoomable-bar-chart
// https://www.d3-graph-gallery.com/graph/interactivity_zoom.html
// https://observablehq.com/@d3/zoomable-scatterplot?collection=@d3/d3-zoom
