/* globals d3 */
export default function StackedAreaChart(container) {
  // initialization
  const margin = { top: 20, right: 10, bottom: 30, left: 50 };
  const width = 650 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let border = 1;
  let bordercolor = "white";

  const svg2 = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
       
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  

  //create scales
  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  //create path element
  const area_chart = svg2.append("path").attr("class", "area-chart2");

  //create axis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale); //.scale(yScale);

  const x = svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis2");

  const y = svg2.append("g")
 //   .attr("transform", "translate(0," + margin.left + ")")
    .attr("class", "y-axis2");

  const tooltip = svg2
    .append("text")
    .attr("class", "tooltip_stacked")
    .attr("x", 30)
    .attr("y", 40);

  let selected = null, xDomain, data;
  
   svg2.append("text")
	  .text("Fossil Fuel Emissions By Type")
    .attr("x", 300)
    .attr("y", 0)
     .attr("text-anchor", "middle")
        .style("stroke", "black")
    .style("stroke-width", border)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline")
  
  
//   million metric tons of C
  
   svg2.append("text")
	  .text("Mil. Metric Tons of C")
    .attr("x", 10)
    .attr("y", -5)
     .attr("text-anchor", "middle")
        .style("stroke", "black")
    .attr("font-size", 10)
      .attr("color", "black")
  
   svg2.append("text")
	  .text("Year")
    .attr("x", 580)
    .attr("y", height+25)
     .attr("text-anchor", "middle")
        .style("stroke", "black")
    .attr("font-size", 10)
      .attr("color", "black")
  

  //UPDATE FUNCTION
  function update(_data) {
    //getting keys
    data = _data;
   
    
//     const uniqueIds = [];
//     const unique = data.filter(item => {
//       const isDuplicate = uniqueIds.includes(item.Year);
//       if (!isDuplicate) {
//         uniqueIds.push(item.Year);
//         return true;
//       }
//       return false;
//     });

//     console.log(unique);
//     Object.keys(unique).forEach(key => {
//       if (unique[key] === null) {
//         delete unique[key];
//       }
//     });
    
//     unique.columns = [
// "Year",
// "All_Countries_Fossil_Fuels_And_Cement_Per_Year",
// "All_Countries_Solid_Fuel_Per_Year",
// "All_Countries_Liquid_Fuel_Per_Year",
// "All_Countries_Gas_Fuel_Per_Year",
// "All_Countries_Cement_Per_Year",
// "All_Countries_Gas_Flaring_Per_Year",
// "All_Countries_Capita_Per_Year"]

//     console.log(unique); 
    
    var keys = selected? [selected] : Object.keys(data[0]).slice(2);
    keys.reverse()
    console.log(keys)


    //creating stack and series
    var stack = d3
      .stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

  
    var series = stack(data.map(d => d));

    // update scales, encodings, axes (use the total count)
    
 //THIS IS WHAT I NEED   d3.map(series, d=> d3.extent(d, d => console.log(d.data.date))) //.clamp(true).nice(d3.timeWeek)))

    xScale.domain(xDomain ? xDomain : d3.extent(data.map((i) => i.Year))).clamp(true).nice()
    yScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    colorScale.domain();

    let curve = d3.curveLinear;
    
  
    var stacked_area_generator = d3
      .area()
      .x((d) => xScale(d.data.Year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    const areas = svg2.selectAll(".area").data(series, (d) => d.key);
  

    areas
      .enter()
      .append("path")
      .merge(areas)
      .attr("class", "area")
     .attr("d", stacked_area_generator)
      .attr("fill", (d) => colorScale(d.key))
      .on("mouseenter", function (event, d) {
        //tooltip
        const [x, y] = d3.pointer(event, d);
        d3.select(".tooltip_stacked")
          .style("left", x + 300 + "px")
          .style("top", y + 100 + "px")
          .style("display", "block")
          .style("position", "fixed")
          .html("Fuel Type: " + d.key);
        d3.select(this).attr("opacity", 0.2);
      })
      .on("mouseleave", function (d) {
        d3.select(".tooltip").style("display", "none");
        d3.select(this).attr("opacity", 1);
      })
    .on("click", (event, d) => {
		// toggle selected based on d.key
		if (selected === d.key) {
      selected = null;
    } else {
	    selected = d.key;
    }
      update(data); // simply update the chart again
});
    areas.exit().remove();
    
    

    svg2.select(".x-axis2").call(xAxis);
    svg2.select(".y-axis2").call(yAxis);
  }
  function filterByDate(range) {
    xDomain = range;
    update(data);
  } 

  return {
    update,
    filterByDate, // ES6 shorthand for "update": update
  };
}
