// we would code CO2 emissions, temperature rise, and time into a trend chart here
/* globals d3 */

export default function TrendChart(data, temp, container) {
  
  data.forEach(function (row) {
    const int_year = row.Year;
    const date = new Date(+int_year, 0, 0);
    row.Date = date;
  });

  temp.forEach(function (row) {
    const int_year = row.dt.getFullYear();
    row.Year = int_year;
  });

  //remove undefined values
  const clean_temp = [];
  temp.forEach(function (row) {
    if (row.LandAverageTemperature == undefined || row.Year == undefined) {
      let z = "skip";
    } else {
      clean_temp.push(row);
    }
  });

  temp = clean_temp;

  // temp.forEach(function (row)
  var i = 0;
  let averages = [];
  while (i < temp.length-1) {
    const start_year = temp[i].Year;
    var j = i + 1;

    const yearly_temps = [temp[i].LandAverageTemperature];

    while (temp[j].Year == start_year && j+1 < temp.length) {
      i++;
      if (temp[j].Year > -500) {
        yearly_temps.push((temp[j].LandAverageTemperature*1.8)+32);
        j++;
      } else {
        j++;
      }
    }
    if (yearly_temps.length < 6) {
      console.log(start_year)
      console.log("avg", (yearly_temps.reduce((a, b) => a + b) / yearly_temps.length))
    }
    else {
      const year_avg = {
        year: start_year,
        avg: yearly_temps.reduce((a, b) => a + b) / yearly_temps.length,
      };
      averages.push(year_avg);
      } 
    i++;
    
  }
  
  averages.forEach(function (row) {
    const int_year = row.year;
    const date = new Date(+int_year, 0, 0);
    row.Date = date;
  });
  averages.shift()
  console.log(averages)

  data.reverse();

 

  const margin = { top: 80, right: 70, bottom: 20, left: 70 };
  const width = 620 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

  var border = 1;
  var bordercolor = "#2800FF";

  //create svg with margin convention
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .on("pointerenter pointermove", pointermoved)
    // .on("pointerleave", pointerleft)
    // .on("touchstart", event => event.preventDefault())
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //create scales
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);
  const xScaleTemp = d3.scaleTime().range([0, width]);
  const yScaleTemp = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom(xScale).ticks(15);
  const yAxis = d3.axisLeft(yScale);
  const zAxis = d3.axisRight(yScaleTemp);

  const x = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis");

  const y = svg.append("g").attr("x", 500).attr("class", "y-axis");
  const z = svg.append("g").attr("class", "z-axis").attr("transform", "translate(" + width + " ,0)")
;

  xScale.domain(d3.extent(data, (d) => d.Date)).nice();
  yScale
    .domain([
      0,
      d3.max(data, (d) => d.All_Countries_Fossil_Fuels_And_Cement_Per_Year),
    ])
    .nice();
  xScaleTemp.domain(d3.extent(averages, (d) => d.Date)).nice();
  yScaleTemp.domain(d3.extent(averages, (d) => d.avg)).nice();

  svg.select(".x-axis").call(xAxis);
  svg.select(".y-axis").call(yAxis);
  svg.select(".z-axis").call(zAxis);

svg.append("text")
	  .text("C02 Emissions from Fossil Fuels (Kt)")
    .attr("x", 45)
    .attr("y", -10)
     .attr("text-anchor", "middle")
        .style("stroke", bordercolor)
    .style("stroke-width", border)
    .attr("font-size", 14)
      .attr("color", "blue")
  
  bordercolor = "black"
    border = 1
  
  //title fossil fuels
  svg.append("text")
	  .text("Global Temperature In Relation To Fossil Fuel Usage")
    .attr("x", 250)
    .attr("y", -60)
     .attr("text-anchor", "middle")
        .style("stroke", bordercolor)
    .style("stroke-width", border)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline")

   svg.append("text")
	  .text("Global Heatmap")
    .attr("x", 700)
    .attr("y", -30)
     .attr("text-anchor", "middle")
        .style("stroke", bordercolor)
    .style("stroke-width", border)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline")


  
    border = 1;
    bordercolor = "red";
  
  svg.append("text")
	  .text("Degrees Farenheit")
    .attr("x", 465)
    .attr("y", -10)
     .attr("text-anchor", "middle")
        .style("stroke", bordercolor)
    .style("stroke-width", border)
    .attr("font-size", 14)
    .attr("color", "red")
    .attr("class", "degtitle")

 
 
  //fossil fuels
  const line = d3
    .line()
    .x((data) =>  xScale(data.Date))
    .y((data) =>  yScale(data.All_Countries_Fossil_Fuels_And_Cement_Per_Year))
    // .on("mouseenter", function (event, d) {
    //     //tooltip
    //     const [x, y] = d3.pointer(event, d);
    //     d3.select(".tooltip")
    //       .style("left", x + 100 + "px")
    //       .style("top", y + 400 + "px")
    //       .style("display", "block")
    //       .style("position", "fixed")
    //       .html("Date: " + d.Date)
    //       .html("Fossil Fuels and Cement: " + d.All_Countries_Fossil_Fuels_And_Cement_Per_Year);
    //     d3.select(this).attr("opacity", 0.2);
    //   })
    //   .on("mouseleave", function (d) {
    //     d3.select(".tooltip").style("display", "none");
    //     d3.select(this).attr("opacity", 1);
    //   });


  // Add path
  const path = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 3)
    .attr("d", line)
  
    const templine = d3
    .line()
    .x(averages => xScale(averages.Date))
    .y((averages) => yScaleTemp(averages.avg));
  
   const temppath = svg
    .append("path")
    .datum(averages)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 3)
    .attr("d", templine);

  
 function pathfunction(path, temppath) {
   console.log("restarting")
  
  

  const pathLength = path.node().getTotalLength();

  const transitionPath = d3.transition().ease(d3.easeSin).duration(15000);

  path
    .attr("stroke-dashoffset", pathLength)
    .attr("stroke-dasharray", pathLength)
    .transition(transitionPath)
    .attr("stroke-dashoffset", 0)
    .attr("class", "path");
  
  
  //tooltip
  // var focus = svg.append("g")
  //           .attr("class", "focus")
  //           .style("display", "none");

        // focus.append("circle")
        //     .attr("r", 5);

        // focus.append("rect")
        //     .attr("class", "tooltip")
        //     .attr("width", 100)
        //     .attr("height", 50)
        //     .attr("x", 10)
        //     .attr("y", -22)
        //     .attr("rx", 4)
        //     .attr("ry", 4);

//         focus.append("text")
//             .attr("class", "tooltip")
//             .attr("x", 18)
//             .attr("y", -2);

//         focus.append("text")
//             .attr("x", 18)
//             .attr("y", 18)
//             .text("Likes:");

//         focus.append("text")
//             .attr("class", "tooltip")
//             .attr("x", 60)
//             .attr("y", 18);

//         svg.append("rect")
//             .attr("class", "overlay")
//             .attr("width", 100)
//             .attr("height", 100)
//             .attr("background-color", )
//             .on("mouseover", function() { focus.style("display", null); })
//             .on("mouseout", function() { focus.style("display", "none"); })
//             .on("mousemove", mousemove);
  
//   var bisectDate = d3.bisector(function(d) { return d.Date; }).left


//         function mousemove() {
//             var x0 = x.invert(d3.mouse(this)[0]),
//                 i = bisectDate(data, x0, 1),
//                 d0 = data[i - 1],
//                 d1 = data[i],
//                 d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
//             focus.attr("transform", "translate(" + xScale(d.Date) + "," + yScale(d.All_Countries_Fossil_Fuels_And_Cement_Per_Year) + ")");
//             focus.select(".tooltip").text((d.Date));
//             focus.select(".tooltip").text((d.All_Countries_Fossil_Fuels_And_Cement_Per_Year));
//         }
    
  
  
 //tooltip
//   const tooltip = svg.append("g")
//       .style("pointer-events", "none");

//   const X = d3.map(data,d => d.Date)
//   const Y = d3.map(data,d => d.All_Countries_Fossil_Fuels_And_Cement_Per_Year)
//   function pointermoved(event) {
//     const i = yScale.invert(d3.pointer(event)[1])
//     tooltip.style("display", null);
//     tooltip.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);

//     const path = tooltip.selectAll("path")
//       .data([,])
//       .join("path")
//         .attr("fill", "white")
//         .attr("stroke", "black");

//     const text = tooltip.selectAll("text")
//       .data([,])
//       .join("text")
//       .call(text => text
//         .selectAll("tspan")
//         .data(`${([i])}`.split(/\n/))
//         .join("tspan")
//           .attr("x", d3.pointer(event)[0])
//           .attr("y", d3.pointer(event)[1])
//           .attr("font-weight", (_, i) => i ? null : "bold")
//           .text(d => d));

//     const {x, y, width: w, height: h} = text.node().getBBox();
//    // text.attr("transform", `translate(${-w / 2},${15 - y})`);
//   //  path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
//     svg.property("value", data).dispatch("input", {bubbles: true});
//   }

//   function pointerleft() {
//     tooltip.style("display", "none");
//     svg.node().value = null;
//     svg.dispatch("input", {bubbles: true});
//   }
  
  //add legend
//   var legend_keys = [{title: "Temperature (Farenheit)", color: "red"},{title:"Global Fossil Fuel Emissions", color: "steelblue"}]
// var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
//     .enter().append("g")
//     .attr("class","lineLegend")
//     .attr("transform", function (d,i) {
//             return "translate("+ width + "," + (i*20)+")";
//         });

// lineLegend.append("text").text(function (d) {return d.title;})
//     .attr("transform", "translate(15,9)")
//   .attr("x", 30)
//       .attr("class","lineLegendtext")

//    // .attr("y", 30); //align texts with boxes

// lineLegend.append("rect")
//     .attr("fill", function (d, i) {return (d.color); })
//     .attr("width", 10).attr("height", 10)
//     .attr("x", 30)
 //   .attr("y", 30);
  
  // const interactive_timeline
  
  
//   temp
 

  // Add path
 
  const temppathLength = temppath.node().getTotalLength();

  const temptransitionPath = d3.transition().ease(d3.easeSin).duration(15000);

  temppath
    .attr("stroke-dashoffset", temppathLength)
    .attr("stroke-dasharray", temppathLength)
    .transition(temptransitionPath)
    .attr("stroke-dashoffset", 0);
  
 }
  pathfunction(path,temppath)
  
   d3.select("#restart").on("click" ,d => {
     console.log("clicked")
    pathfunction(path,temppath)
  });
  
  
  
  
  function timeline(on) {
    
    if (on) {
    const annotations = [{
        note: {
          label: "Industrial Revolution Begins - 1760",
       //   title: "Industrial Revolution Begins"
        },
        x: 35,
        y: 72,
        dy: -20,
        dx: 30,
        color: "grey",
        //add formatting
        subject: {
          radius: 10,
          radiusPadding: 5
        },
        type:d3.annotationCalloutCircle
      }, {note: {
          label: "Industrial Revolution Ends - 1840",
         // title: "Industrial Revolution Ends"
        },
        x: 170,
        y: 150,
        dy: -70,
        dx: 0,
                  color: "grey",

        //add formatting
        subject: {
          radius: 10,
          radiusPadding: 5
        },
        type: d3.annotationCalloutCircle
      //   connector: {
      //    // type: "curve",
      //   end: "dot" // 'dot' also available
      // },
      }, {note: {
          label: "First Commercial Oil Well Was Drilled - 1859",
        //  title: "First Modern Commercial Oil Well Was Drilled"
          // align: "middle"
        },
        x: 204,
        y: 415,
        dy: -20,
        dx: -40,
                  color: "grey",

        //add formatting
        subject: {
          radius: 10,
          radiusPadding: 5
        },
        type:d3.annotationCalloutCircle
        // connector: {
        //   type: "curve",
        // end: "arrow" // 'dot' also available
      // },
      }, {note: {
          label: "Cars Are Invented - 1885",
         // title: "Cars Are Invented"
        },
        x: 260,
        y: 405,
        dy: -80,
        dx: -1,
                  color: "grey",

        //add formatting
        subject: {
          radius: 10,
          radiusPadding: 5
        },
        type:d3.annotationCalloutCircle
      }, {note: {
          label: "Petroleum is Most Used Fuel in USA - 1950",
         // title: "Cars Are Invented"
        },
        x: 357,
        y: 355,
        dy: -20,
        dx: 30,
                  color: "grey",

        //add formatting
        subject: {
          radius: 10,
          radiusPadding: 5
        },
        type:d3.annotationCalloutCircle
      },  {note: {
          label: "BP Oil Spill in Gulf of Mexico - 2010",
         // title: "Cars Are Invented"
        },
        x: 465,
        y: 60,
        dy: -20,
        dx: -40,
                   color: "grey",

        //add formatting
        subject: {
          radius: 10,
          radiusPadding: 5
        },
        type:d3.annotationCalloutCircle
      }  ]

    const makeAnnotations = d3.annotation()
        .annotations(annotations)

      svg.append('g')
        .attr('class', 'annotation-group')
        .call(makeAnnotations)
  
  d3.select('.annotation-group')
      .transition()
      .duration(4000)
      .tween('updateAnno',function(d){
        var xTrans = d3.interpolateNumber(0,200)
        var timeTrans = d3.interpolateDate(new Date("January 01, 2019 00:00:00"),new Date(new Date("January 01, 2019 00:00:00").getTime()+200*60000))
        return function(t){
       //   annotations[0].x = xScale(xTrans(t));
     //     annotations[0].note.label = d3.timeFormat("%H:%M")(timeTrans(t))
          makeAnnotations.annotations(annotations)
          makeAnnotations.update()
        }
      })
    }
    else {
       d3.select(".annotation-group").remove()

    }
    
  }
  
  let on = false;
  
  d3.select("#sort").on("click" ,d => {
    on = !on;
    timeline(on)
  });

  
 
}
