/* globals d3, topojson*/
export default function heatmap(data,worldmap, container) {

// console.log(data)
//set svg
  // const outerWidth = 1000;
  // const outerHeight = 1000;

  const margin = { top: 40, right: 10, bottom: 10, left: 10 };
  const width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  let border = 1;
  let bordercolor = "#2800FF";

  //create svg with margin convention
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  
      
//   const clean = []
  
//       const uniqueYears = [];
//     const unique = data.filter(item => {
//       const isDuplicate = uniqueYears.includes(item.Year);
//       if (!isDuplicate) {
//         uniqueYears.push(item.Year);
//         return true;
//       }
//       return false;
//     });
  
//   uniqueYears.forEach(function(row) {
//       const new_row = {Year: row}
//   clean.push(new_row)
//   })
//   console.log(clean)
//   // final = []
  
//   data.forEach(function(row) {
//      const search = row.Year 
//     const isFound = clean.some(element => {
//       if (element.Year === search) {
//         // final.push({element.Year})
//         const new_country = row.Country
//         const new_temp = row.AverageTemperature
//         if (new_temp == null) {
//           element[new_country] = 0
//         }
//         else {
//           element[new_country] = new_temp
//         }
//       }
//     })
//  })
//   console.log(clean)
  
  
  // def func():
  //   sum = 2+3
  //   dif = 2-3
  //   return sum, dif
  // sum,dif = func()
  
  
  //size scale
  // const size = d3
  //   .scaleLinear()
  //   .domain(d3.extent(airports_data.nodes, (d) => d.passengers))
  //   .range([5, 15]);
  
  
  console.log("avg temp",data["AverageTemperature"])
  
    for (const row of data) {
      if (row.AverageTemperature == null) {
        let skip = 1
        data["Faren"] = null
      }
      else {
        
        
        const old = (row.AverageTemperature)
          //  console.log("old", old)

      row.AverageTemperature = old * 9/5 +32
            
          // console.log("hey",row.AverageTemperature)
           }
    }
  
 
  //map section

  // conver topojson to geojson, extract state info
  const features = topojson.feature(
    worldmap,
    worldmap.objects.countries
  ).features;

  // fit the geoJSON to the specified extent
  const projection = d3.geoMercator().fitExtent(
    [
      [0, 0],
      [width, height],
    ], // available screen space
    topojson.feature(worldmap, worldmap.objects.countries) // geoJSON object
  );

  // create a geo path generator using the projection
  const path = d3.geoPath().projection(projection);

  // fill paths
  const fill_paths = svg
    .selectAll("path")
    .data(features) // geojson feature collection
    .join("path")
    .attr("d", (d) => path(d))
    .attr("class", "worldmap")
    .attr("fill", "white")
    

  
  // boundary paths using GeoJSON lines
  

  // svg
  //   .append("path")
  //   .datum(topojson.mesh(worldmap, worldmap.objects.countries)) // extract GeoJSON lines
   svg.selectAll("path")
      .data(features)  
  .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .attr("class", "worldmap")
    .attr("d", path)
//    .on("mouseenter", function (event, d) {
//         //tooltip
//      const country = start.find((s) => s.Country == d.properties.name);
//       if (!country) return "white";
//       let temp_update = country.AverageTemperature
      
//         const [x, y] = d3.pointer(event, d);
//         console.log(d)

//         d3.select(".tooltip_map")
//           .style("display", "block")
//           // .style("position", "e")
//           .html("Country: " + d.properties.name + " Avg. Temperature: " +temp_update)
//        // .html("Avg. Temperature: " + temp_update)
//         d3.select(this).attr("opacity", 0.2);
//       })
//       .on("mouseleave", function (d) {
//         d3.select(".tooltip_map").style("display", "none");
//         d3.select(this).attr("opacity", 1);
//       });
  
  
  const start = []
  const new_data = data.map((d) => {
    if (d.Year === 1743) {
        start.push(d)        
      }
      else {
        const x = 'nothing'
        }      
    if (start.length > 0) {
      return start
    }
  })
  
  
   const color = d3
      .scaleSequential(d3.interpolateReds)
      .domain(d3.extent(start, (d) => {
        return d.AverageTemperature}));
  
   fill_paths.attr("fill", (d) => {
      const country = start.find((s) => s.Country == d.properties.name);
      if (!country) return "white";
      let temp_update = country.AverageTemperature
      if (temp_update == null) {
        temp_update = 0
      }
      
      return color(temp_update);
    });
  
  // d3.select("#slider")
  //   // .attr("max", availableDays)
  //   .on("input", function() {
  //     update(+this.value);
  // });
  
  
  
   svg.append("text")
	  .text("Global Heatmap")
    .attr("x", 370)
    .attr("y", -10)
     .attr("text-anchor", "middle")
        .style("stroke", "black")
    .style("stroke-width", border)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline")
  
  let selected = null, xDomain;

  
  function update(selection, data) {

    const year = selection;
    const new_data = update_data(year, data)
    console.log("new data",new_data)
    d3.select("#date").text((year));

    
     const color = d3
      .scaleSequential(d3.interpolateReds)
      .domain(d3.extent(new_data, (d) => {
        return d.AverageTemperature}));
    
    fill_paths.attr("fill", (d) => {
      const country = new_data.find((s) => s.Country == d.properties.name);
      if (!country) return "white";
      let temp_update = country.AverageTemperature
      if (temp_update == null) {
        temp_update = 0
      }
      
      return color(temp_update);
    });
    
    
     const tooltip = svg
      .append("text")
      .attr("class", "tooltip_map")
      // .attr("x", 300)
      // .attr("y", 300);


     svg
      .data(features)  
    .attr("d", path)
//     .on("mouseenter", function (event, d) {
//         //tooltip
//        console.log(event,d)
//      // const country = start.find((s) => {
//      //   console.log(s)
//      //   return s.Country == d.properties.name});
       
//       if (!country) return "white";
//       let temp_update = country.AverageTemperature
//       console.log(temp_update)
//        let xPosition =
//         margin.left +
//         width / 2 +
//         parseFloat(d3.select(this).attr("x"))
//        // +
//        //  x.bandwidth() / 2;
//       let yPosition =
//         margin.top + parseFloat(d3.select(this).attr("y")) / 2 + height;

//       //Update the tooltip position and value
//       d3.select("#tooltip")
//         .style("left", xPosition + "px")
//         .style("top", yPosition + "px")
//         .select("#value")
//         .text(temp_update);

    
//       //Show the tooltip
//       d3.select("#tooltip").classed("hidden", false);
//     })
//     .on("mouseout", function(d) {
//       //Hide the tooltip
//       d3.select("#tooltip").classed("hidden", true);
//     });

      
//         const [x, y] = d3.pointer(event, d);
//         console.log(d)

//         d3.select(".tooltip_map")
//         .style("left", x +"px")
//           .style("top", y+ "px")
//           // .style("display", "block")
//         // .style("position", "fixed")
//           .text("Country: " + d.properties.name + " Avg. Temperature: " +temp_update)
//        // .html("Avg. Temperature: " + temp_update)
//         d3.select(this).attr("opacity", 0.2);
//       })
//       .on("mouseleave", function (d) {
//         d3.select(".tooltip_map").style("display", "none");
//         d3.select(this).attr("opacity", 1);
//       });
  
  
  };
  
  function update_data(year, data) {

    const new_selection = []
    const new_data = data.map((d) => {
      if (d.Country == "Russia") {
        d.Country = "Russian Federation"
      }
      if (d.Country == "Congo (Democratic Republic Of The)") {
          d.Country = "the Democratic Republic of the Congo"
          }
      if (d.Country == "Libya") {
          d.Country = "Libyan Arab Jamahiriya"
      }
      if (d.Country == "Tanzania") {
        d.Country = "United Republic of Tanzania"
      }
      if (d.Country == "Côte D'Ivoire") {
        d.Country = "Cote d'Ivoire"
      }
      if (d.Country == "Iran") {
        d.Country = "Islamic Republic of Iran"
      }
      if (d.Country == "Vietnam") {
          d.Country = "Vietnam"
      }
      if (d.Country == "Laos") {
          d.Country = "Lao People's Democratic Republic"
      }
      
      if (d.Year === year) {
        new_selection.push(d)        
      }
      else {
        const x = 'nothing'
        }      
    })
    if (new_selection.length > 0) {
      return new_selection
    }
  }
  return {
    update,
    update_data,
  };
    
  
}