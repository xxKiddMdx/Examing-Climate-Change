/* globals d3 */
export default function temp_bar(container, data, comparing) {
  let margin = { top: 40, right: 20, bottom: 40, left: 90 },
    width = 400,
    height = 485 - margin.top - margin.bottom;

  width = width > 600 ? 600 : width;
  d3.select(".area").remove();

  let svg = d3
    .select(".temp_bar")
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

  //   let xAxisGroup = svg.append("g").attr("class", "x-axis axis");

  //   let yAxisGroup = svg.append("g").attr("class", "y-axis axis");
  const xAxisGroup = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "axis x-axis");

  const yAxisGroup = svg.append("g").attr("class", "axis y-axis");

  let yAxisLabel = svg
    .append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "end")
    .attr("y", -15)
    .attr("x", 50);
  
  svg.append("text")
        .attr("x", 230)             
        .attr("y", -20)
        .attr("text-anchor", "middle")    
        .text("CO2 Emissions Across Countries")
       .attr("text-anchor", "middle")
        .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline");

  const bars = svg.selectAll(".bar");

  function update(data, comparing) {
    // console.log("hello")

    const new_data = [];
    comparing.forEach(function (country) {
      let find = data.filter((d) => d.Country === country)[0];
      new_data.push(find);
    });

    // let filter = data.filter((d) => d.Country === country)[0];
    // let array = Object.values(filter);
    // array.shift();
    // array.shift();

    // console.log(filter);
    // console.log(array);
    // x.domain([filter.Country, "World Average"]);
    // y.domain([0, d3.max([array[0], array[1] / 220])]);

    x.domain(new_data.map((d) => d.Country));
    y.domain([
      0,
      d3.max(new_data, (d) => d.Country_Fossil_Fuels_And_Cement_Per_Year),
    ]);

    let max = 0;

    new_data.forEach((data) => {
      if (data.Country_Fossil_Fuels_And_Cement_Per_Year > max) {
        max = data.Country_Fossil_Fuels_And_Cement_Per_Year;
        // issue: max is not updating?
      }

    });

 
    const bars = svg.selectAll(".bar").data(new_data, (d) => d.company);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.Country))
      .attr("y", height)
      .attr("fill", "lightgrey")
      .attr("width", x.bandwidth())
      .transition()
      .duration(1000)
      .attr(
        "height",
        (d) => height - y(d.Country_Fossil_Fuels_And_Cement_Per_Year)
      )
      .attr("fill", "red")
      // .attr("x", d =>  x(d.Country))
      .attr("y", (d) => y(d.Country_Fossil_Fuels_And_Cement_Per_Year));

  
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);
  

    svg.select("text.axis-title").remove();
    bars.exit().remove();
    
  
  }
  update(data, comparing);

  // add event listener to button

  
}
