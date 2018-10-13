import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// create an SVG
var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left * 4 + ',' + height / 2 + ')')

// create a pie
var pie = d3.pie().value(function(d) {
  return d.minutes
})

// define our radius
var radius = 80

// make an arc generator
var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

// create color scale
var colorScale = d3
  .scaleOrdinal()
  .range(['pink', 'cyan', 'magenta', 'mauve'])

// create an x scale to use for the g's
let xPositionScale = d3
  .scaleBand()
  .domain([0, 4])
  .range([0, width])

// read in data
d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// ready function
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)
  // console.log('this is nested', nested)
  // console.log('this is datapoints', datapoints)

  var project = nested.map(d => d.key)
  xPositionScale.domain(project)
  // console.log('this is project', project)

  svg
    .selectAll('.projects')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'projects')
    .attr('transform', function(d) {
      // console.log('this is transforms d', d)
      return 'translate(' + xPositionScale(d.key) + ',0)'
    })
    .each(function(d) {
      var container = d3.select(this)

      container
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))


      container
        .append('text')
        .text(d.key)
        .attr('dy', radius * 1.3)
        .attr('text-anchor', 'middle')
    })
}
