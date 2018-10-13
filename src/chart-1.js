import * as d3 from 'd3'

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3.pie().value(function(d) {
  return d.minutes
})

var radius = 100

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var labelArc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius * 2.2)

var colorScale = d3
  .scaleOrdinal()
  .range(['pink', 'cyan', 'magenta', 'mauve'])

d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // Build a container and move it to the middle
  // because we can't set the cx/cy on the radial
  // charts even though they're circular
  var container = svg.append('g').attr('transform', 'translate(200,200)')

  // console.log(pie(datapoints))

  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task))

  container
    .selectAll('text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    .attr('transform', function(d) {
      return 'translate(' + labelArc.centroid(d) + ')'
    })
    .attr('text-anchor', function(d) {
      if(d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}