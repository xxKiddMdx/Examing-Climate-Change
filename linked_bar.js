/* globals d3 */
export default function linked_bar(data, country) {
  let margin = { top: 40, right: 20, bottom: 40, left: 90 },
    width = 400,
    height = 400 - margin.top - margin.bottom;

  width = width > 600 ? 600 : width;
  d3.select(".area").remove();

  let svg = d3
    .select(".linked_bar")
    .append("svg")
    .attr("class", "area")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // AXIS

  let x = d3.scaleBand().range([0, width]).paddingInner(0.1);

  let y = d3.scaleLinear().range([height, 0]);

  let xAxis = d3.axisBottom().scale(x);

  let yAxis = d3.axisLeft().scale(y);

  let xAxisGroup = svg.append("g").attr("class", "x-axis axis");

  let yAxisGroup = svg.append("g").attr("class", "y-axis axis");

  const bars = svg.selectAll(".bar");

  function update(data, country) {
    let filter = data.filter((d) => d.Country === country)[0];
    let array = Object.values(filter);
    array.shift();
    array.shift();

    console.log(filter);
    console.log(array);
    x.domain([filter.Country, "World Average"]);
    y.domain([0, d3.max([array[0], array[1] / 220])]);

    let y1 = array[0];

    let y2 = array[1] / 220;
    let x1 = filter.Country;
    let x2 = "World Average";
    // why is y2 0?
    // ---- DRAW BARS ----
    let bars = svg.selectAll(".bar").remove().exit().data(data);
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(x1))
      .attr("y", y(y1))
      .attr("width", x.bandwidth())

      .transition()
      .duration(1000)
      .attr("height", height - y(y1))
      .attr("fill", "lightgrey");

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(x2))
      .attr("y", y(y2))
      .attr("width", x.bandwidth())

      .transition()
      .duration(1000)
      .attr("height", height - y(y2))
      .attr("fill", "lightgrey");

    bars
      .append("text")
      .attr("x", x(x1) + margin.left)
      .attr("y", -10)
      .attr("stroke", "black")
      .attr("fill", "lightblue")
      .text(y1);
    // ---- DRAW AXIS	----
    xAxisGroup = svg
      .select(".x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    yAxisGroup = svg
      .select(".y-axis")
      .call(yAxis)
      .append("text")
      .attr("x", x(x1))
      .attr("y", -10)
      .attr("stroke", "black")
      .text("Kilo Tons");

    svg.select("text.axis-title").remove();
    bars.exit().remove();
  }
  update(data, country);
}
