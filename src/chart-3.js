import * as d3 from 'd3'

var margin = { top: 0, left: 30, right: 30, bottom: 0 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 150

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([0, radius])

var angleScale = d3
  .scaleBand()
  .range([0, Math.PI * 2])

var colorScale = d3
  .scaleLinear()
  .domain([0, 90])
  .range(['lightblue', 'pink'])

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var holder = svg.attr('transform', `translate(${width / 3},${height / 2})`)

  var months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  holder
    .selectAll('.temp-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', d => {
      // console.log('this is the orig d', d)
      return arc(d)
    })
    .attr('fill', d => colorScale(d.high_temp))

  holder
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2)
  var title = 'N.Y.C. High Temperatures, by Month'
  
  holder
    .datum('title')
    .append('text')
    .text(title)
    .attr('font-weight', '600')
    .attr('font-size', 30)
    .attr('text-anchor', 'middle')
    .attr('y', -radius/2)
    .attr('dy', -30)


}