import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

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

let bands = [20, 30, 40, 50, 60, 70, 80, 90] 

let labels = ['30', '50', '70', '90'] 
// radius scale
let radius = 140

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([0, radius])

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


function ready(datapoints) {
  datapoints.push(datapoints[0])
  // console.log('this is datapoints', datapoints)

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightblue')
    .attr('opacity', 0.75)
    .attr('stroke', 'none')

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke-width', .5)
    .attr('stroke', 'black')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  holder
    .selectAll('.scale-text')
    .data(labels)
    .enter()
    .append('text')
    .text(d => {
      return d + '°'
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)

  holder
    .append('text')
    .text('NYC')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-weight', 600)
    .attr('font-size', 30)

}
