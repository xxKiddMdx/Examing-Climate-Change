/*globals d3 */
export default function AreaChart(container) {
  // initialization
  const outerWidth = 650;
  const outerHeight = 500;

  const margin = { top: 50, right: 20, bottom: 40, left: 50 };
  const width = 650 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  let border = 1;
  let bordercolor = "white";

  //create svg with margin convention
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  
  //create scales
  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);

  //create path element
  /*\   const area_chart = svg
      .append("path")
      .attr("class", "area-chart"); */

  //create axis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const x = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis");

  const y = svg
    .append("g")
    .attr("class", "y-axis");
  
    svg.append("text")
	  .text("Total Fossil Fuel Emissions")
    .attr("x", 300)
    .attr("y", -10)
     .attr("text-anchor", "middle")
        .style("stroke", "black")
    .style("stroke-width", border)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline")
   svg.append("text")
	  .text("Mil. Metric Tons of C")
    .attr("x", 10)
    .attr("y", -5)
     .attr("text-anchor", "middle")
        .style("stroke", "black")
    .attr("font-size", 10)
      .attr("color", "black")
  
  svg.append("text")
	  .text("Year")
    .attr("x", 585)
    .attr("y", 123)
     .attr("text-anchor", "middle")
        .style("stroke", "black")
    .attr("font-size", 10)
      .attr("color", "black")
  

  const brush = d3
    .brushX()
    .extent([
       [0,0], [width,height],  //  [margin.left, margin.top], [width - margin.right, height - margin.bottom],
    ])
    .on("brush", brushed)
    .on("end", brushend)
  
svg.append("g").attr('class', 'brush').call(brush);
  
   const listeners = {brushed: null};
  console.log(listeners)

  function brushed(event) {
   if (event.selection) {

    listeners["brushed"](event.selection.map(d =>xScale.invert(d)))
   }
  }
    
     function brushend(event) {
   if (!event.selection) {
    listeners["brushed"](null)
   }
  }
  

  //UPDATE FUNCTION
  function update(data) {
    console.log(data)
    svg.append("g").attr('class', 'brush').call(brush);

    //update scales
    xScale.domain(d3.extent(data.map((i) => i.Year)));
    yScale.domain([0, d3.max(data, (d) => d.Total)]);

    let curve = d3.curveLinear;

    var area_generator = d3
      .area()
      //    .curve(curve)
      .x((d) => xScale(d.Year)) 
      .y1((d) => yScale(d.Total))
      .y0(yScale(0));

    svg
      .append("path") //.select(".area-chart")
      .datum(data)
      .attr("d", area_generator)
      .attr("fill", "steelblue")
 
    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);
  }
  
  function on(event, listener) {
		listeners[event] = listener;
    console.log(listeners)
  }

  return {
    update,
    on// ES6 shorthand for "update": update
  };
}
