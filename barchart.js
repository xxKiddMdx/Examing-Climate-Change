// we would code bar chart here, which displays the CO2 emission level of one country versus the world.
// task to be done: adding labels on the bars, add some other art elements (finished), change the drop down logic (finihsed)
/* globals d3*/

// export default function barchart(container, data, country) {
//import linked_bar from "./linked_bar.js";

const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector(
  "[data-country-cards-countainer]"
);
const serachInput = document.querySelector("[data-search]");
let users = [];

d3.csv("data.csv", d3.autoType).then((data) => {
  // precomputed all the cards 
  users = data.map((country) => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const header = card.querySelector("[data-header]");
    header.textContent = country.Country;
    userCardContainer.append(card);
    card.classList.toggle("hide");
    return { name: country.Country, element: card };
  });
  // deciding which cards to show
  serachInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length === 0) {
      users.forEach((user) => {
        user.element.style.display = "none";
      });
    } else if (value === "all") {
      users.forEach((user) => {
        user.element.style.display = "flex";
      });
    } else {
      users.forEach((user) => {
        const isVisible = user.name.toLowerCase().includes(value);
        if (isVisible) {
          user.element.style.display = "flex";
        } else {
          user.element.style.display = "none";
        }
      });
    }
  });

  let countryName;
  d3.selectAll(".card").on("click", function () {
    countryName = this.textContent;
    // filter the data by selected country name
    let selected_country = data.filter(
      (country) => country.Country === countryName
    );
    console.log(selected_country);
    renderBarChart(selected_country);
    // linked_bar(selected_country,data);
    
    // call render barchart on countryname
  });
});

// define margin etc

let margin = { top: 40, right: 20, bottom: 40, left: 90 },
  width = 400,
  height = 400 - margin.top - margin.bottom;

width = width > 600 ? 600 : width;

let svg = d3
  .select("#chart-area")
  .append("svg")
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

 xAxisGroup = svg
    .select(".x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  yAxisGroup = svg
    .select(".y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "axis-title")
    .attr("x", x(0))
    .attr("y", -10)
    .attr("stroke", "black")
    .text("Kilo Tons");

 svg.append("text")
        .attr("x", width/2)             
        .attr("y", -20)
        .attr("text-anchor", "middle")    
        .text("CO2 Emissions Across Countries")
       .attr("text-anchor", "middle")
        .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("font-size", 20)
      .attr("color", "black")
    .attr("text-decoration", "underline");

function renderBarChart(data) {
  svg.select("text.axis-title").remove();

  x.domain([data[0].Country, "World Average"]);
  // dynamically adjusting the y domain
  y.domain([
    0,
    d3.max([
      data[0].Country_Fossil_Fuels_And_Cement_Per_Year,
      data[0].All_Countries_Fossil_Fuels_And_Cement_Per_Year / 220,
    ]),
  ]);

  let y1 = data[0].Country_Fossil_Fuels_And_Cement_Per_Year;

  let y2 = data[0].All_Countries_Fossil_Fuels_And_Cement_Per_Year / 220;
  let x1 = data[0].Country;
  let x2 = "World Average";
  // why is y2 0?
  // ---- DRAW BARS ----
  let bars = svg.selectAll(".bar").remove().exit().data(data);
  console.log(y1);
  bars
    .enter()
    .append("rect")
    
    .attr("class", "bar")
    .attr("x", x(x1))
    .attr("y", y(y1))
    .attr("fill", "lightgrey")
    .attr("width", x.bandwidth())
    .transition()
    .duration(1000)
    .attr("height", height - y(y1))
    .attr("fill", "red");

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

      

  //   .on("mouseover", function(event, d) {
  //     //Get this bar's x/y values, then augment for the tooltip
  //     let xPosition =
  //       margin.left +
  //       width / 2 +
  //       parseFloat(d3.select(this).attr("x")) +
  //       x.bandwidth() / 2;
  //     let yPosition =
  //       margin.top + parseFloat(d3.select(this).attr("y")) / 2 + height;

  //     //Update the tooltip position and value
  //     d3.select("#tooltip")
  //       .style("left", xPosition + "px")
  //       .style("top", yPosition + "px")
  //       .select("#value")
  //       .text(d.Visitors);

  //     //Show the tooltip
  //     d3.select("#tooltip").classed("hidden", false);
  //   })
  //   .on("mouseout", function(d) {
  //     //Hide the tooltip
  //     d3.select("#tooltip").classed("hidden", true);
  //   });

  // ---- DRAW AXIS	----
  xAxisGroup = svg
    .select(".x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  yAxisGroup = svg
    .select(".y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "axis-title")
    .attr("x", x(0))
    .attr("y", -10)
    .attr("stroke", "black")
    .text("Kilo Tons");
}

