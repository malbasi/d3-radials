import * as d3 from 'd3'

var margin = { top: 30, left: 100, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// additional data for labels
let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

let bands = [20, 40, 60, 80, 100]

let labels = ['20', '60', '100']
// Scales

// radius scale
let radius = 75

let radiusScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([radius / 2.5, radius])

// angleScale
var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

// line generator
var line = d3
  .radialArea()
  .innerRadius(function(d) {
    // console.log('this is inner radius', radiusScale(d.high_temp))
    return radiusScale(d.high_temp)
  })
  .outerRadius(function(d) {
    // console.log('this is outter radius', radiusScale(d.low_temp))
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    // console.log('this is angle', angleScale(d.month_name))
    return angleScale(d.month_name)
  })
  .curve(d3.curveBasis)

// xpos scale for distributing small multiples
let xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // create nested data
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)
  // console.log('this is nested', nested)
  // console.log('this is datapoints', datapoints)

  // add a domain to the xpos scale
  var smalltemps = nested.map(d => d.key)
  xPositionScale.domain(smalltemps)

  // make your gs and space them out
  svg
    .selectAll('.small-temps')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'small-temps')
    .attr('transform', d => {
      // console.log('this is transforms d', d)
      return 'translate(' + xPositionScale(d.key) + ',' + height/2 + ')'
    })
    .each(function(d) {
      var container = d3.select(this)
      d.values.push(d.values[0])
      // console.log('this is .each d', d)

      // draw the temperature lines
      container
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('fill', 'pink')
        .attr('opacity', 0.75)
        .attr('stroke', 'none')

      // draw the scale lines
      container
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke-width', 0.5)
        .attr('stroke', 'black')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      // add the labels to the scale
      container
        .selectAll('.scale-text')
        .data(labels)
        .enter()
        .append('text')
        .text(d => {
          return d + '°'
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', 8)
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)

      // add city names
      container
        .append('text')
        .text(d => d.key)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-weight', 600)
        .attr('font-size', 15)
    })
  svg
    .append('text')
    .text('Average Monthly temperatures')
    .attr('font-size', 30)
    .attr('font-weight', 600)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('x', width/2)

  svg
    .append('text')
    .text('in cities around the world')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('x', width/2)
    .attr('dy', 25)

}
