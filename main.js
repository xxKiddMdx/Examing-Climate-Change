/* globals d3*/
// we would create 3+ visualizations in this file.
// we would refer back to worldmap.js, trendchart.js, biodiversity.js, and barchart.js to create the visualizations

 import TrendChart from "./trendchart.js";
import StackedAreaChart from "./StackedAreaChart.js";
import heatmap from "./heatmap.js";
import AreaChart from "./AreaChart.js";



Promise.all([
  d3.csv("https://raw.githubusercontent.com/lelyu/finalProject/main/Estimates%20Emissions%20of%20CO2%20at%20Country%20And%20Global%20Level-clean.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/sgoliver01/vis/main/GlobalTemperatures.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/sgoliver01/vis/main/global_csv_clean.csv", d3.autoType),
  d3.csv("https://raw.githubusercontent.com/sgoliver01/vis/main/clean%20(1).csv", d3.autoType),
  d3.json("world-110m.json")


  
  

]).then((data) => {
  let gas = data[0];
  let temp = data[1];  
  let gas_totals = data[2];
  let yearly_temps = data[3];
  let map_data = data[4];
  
console.log("gas", gas)
console.log("temp",temp)
 TrendChart(gas,temp,".trendchart");
  
  
  
  const c = AreaChart(".areachart");
  c.update(gas_totals);
  
  
  const d = StackedAreaChart(".stacked-chart");
  d.update(gas_totals);
  console.log("gases", gas_totals)
  
   c.on("brushed", (range) => {
    d.filterByDate(range); // coordinating with stackedAreaChart
  });
  
  
  
  
  const h = heatmap(yearly_temps,map_data, ".world-heat-map")
  // h.update(yearly_temps)
  
  d3.select("#slider")
    .on("input", function() {
      h.update(+this.value, yearly_temps);
  });
  
  
});


