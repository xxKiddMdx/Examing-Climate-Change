// we would create the clickable world map here
import temp_bar from "/temp_bar.js";
/* globals d3, topojson */
Promise.all([d3.json("world-110m.json"), d3.csv("data.csv", d3.autoType)]).then(
  (data) => {
    let map = data[0];
    let countries = data[1];

    // const outerWidth = 700;
    // const outerHeight = 700;

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 700 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    let border = 1;

    let bordercolor = "#2800FF";

    const color = d3
      .scaleSequential(d3.interpolateReds)
      .domain(
        d3.extent(countries, (d) => d.Country_Fossil_Fuels_And_Cement_Per_Year)
      );
    //create svg with margin convention
    const svg = d3
      .select(".worldmap")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("text")
        .attr("x", 330)             
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")    
        .text("C02 Emissions Across The World")
         .attr("text-anchor", "middle")
        .style("stroke", "black")
    .style("stroke-width", border)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline");

    const features = topojson.feature(map, map.objects.countries).features; //

    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [width, height],
      ],
      topojson.feature(map, map.objects.countries)
    );

    const path = d3.geoPath().projection(projection);

    
    //tooltip
    const tooltip = svg
      .append("text")
      .attr("class", "tooltip")
      .attr("x", 30)
      .attr("y", 20);

    var comparing = [];
    temp_bar(".temp_bar", countries, comparing);

    svg
      .selectAll("path")
      .data(features)
      .join("path")
      .attr("d", path)
      .attr("fill", (d) => {
        const country = countries.find((s) => s.Country == d.properties.name);
        if (!country) return "black";
        return color(country.Country_Fossil_Fuels_And_Cement_Per_Year);
      })
      .attr("stroke", "black")
      .attr("stroke-linejoin", "round")
      .on("mouseenter", function (event, d) {
        //tooltip
        const [x, y] = d3.pointer(event, d);
          console.log(d)

        d3.select(".tooltip")
          .style("display", "block")
          .style("position", "fixed")
          .html("Country: " + d.properties.name);
        d3.select(this).attr("opacity", 0.2);
      })
      .on("mouseleave", function (d) {
        d3.select(".tooltip").style("display", "none");
        d3.select(this).attr("opacity", 1);
      })
      .on("click", (event, d) => {
        let country = d.properties.name;
        comparing.push(country);
        console.log("new click", comparing)
        temp_bar(".temp_bar", countries, comparing);
      });

    svg
      .append("path")
      .datum(topojson.mesh(map, map.objects.countries))
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-linejoin", "round")
      .attr("class", "subunit-boundary");
    // event listener for the button
    d3.select(".button2").on("click", function () {
      comparing = [];
      console.log("clear", comparing)

      temp_bar(".temp_bar", countries, comparing);
    });
    console.log(comparing)
  }
);
