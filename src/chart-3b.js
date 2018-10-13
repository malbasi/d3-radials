import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 90

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90])
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
  .outerRadius(function(d) {
    // console.log('this is outerRadius d.high_temp', d)
    // console.log('this is outerRadius', d[0].city)
    return radiusScale(d.high_temp)
  })
  .startAngle(function(d) {
    // console.log('this is startAngle', angleScale(d.month_name))
    return angleScale(d.month_name)
  })
  .endAngle(function(d) {
    // console.log('this is end angle', angleScale(d.month_name) + angleScale.bandwidth())
    return angleScale(d.month_name) + angleScale.bandwidth()
  })

let xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.3)

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  var months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  var city = datapoints.map(d => d.city)
  xPositionScale.domain(city)

  svg
    .selectAll('.cities')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'cities')
    .attr('transform', function(d) {
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      var container = d3.select(this)

      container
        .selectAll('.path')
        .data(d.values)
        .enter()
        .append('path')
        .attr('d', d => {
          // console.log('this is arcs d', d.values)
          return arc(d)
        })
        .attr('fill', d => colorScale(d.high_temp))

      container
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 2)

      container
        .append('text')
        .text(d => d.key)
        .attr('font-size', 16)
        .attr('text-anchor', 'middle')
        .attr('y', radius)
        .attr('dy', 50)
    })
}
