import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Scales ! 
let radius = 250

let radiusScale = d3
  .scaleLinear()
  .domain([0, 80000])
  .range([0, radius])

var angleScale = d3
  .scaleBand()
  .range([0, Math.PI * 2])

var colorScaleBelow = d3
  .scaleSequential(d3.interpolateCool)
  .domain([0, 80000])

var colorScaleAbove = d3
  .scaleSequential(d3.interpolateWarm)
  .domain([40000, 80000])

// line generator
var line = d3
  .radialArea()
  .innerRadius(radiusScale(40000))
  .outerRadius(d => {
    return radiusScale(d.total)
  })
  .angle(function(d) {
    return angleScale(d.time)
  })
  .curve(d3.curveBasis)

// extra data for labels
var timeLabels = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
]

let bands = d3.range(0, 90000, 2000)

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var times = datapoints.map(d => d.time)
  angleScale.domain(times)

  datapoints.push(datapoints[0])

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // add shape
  holder
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'white')
    .attr('stroke', 'orange')

  // add time labels text
  holder
    .selectAll('.labels')
    .data(timeLabels)
    .enter()
    .append('text')
    .text(d => {
      if (d === '00:00') {
        return 'Midnight'
      } else {
        return d.replace(':00', '')
      }
    })
    .attr('x', 0)
    .attr('y', -radius / 1.1)
    .attr('dy', 30)
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('text-anchor', 'middle')
    .attr('fill', 'grey')

  // add outer line
  holder
    .append('circle')
    .attr('r', radius / 1.1)
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('stroke-width', 2)

  // add dots
  holder
    .selectAll('.circles')
    .data(timeLabels)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', 0)
    .attr('cy', -radius / 1.1)
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('stroke-width', 2)
    .attr('stroke', 'white')
    .attr('fill', 'grey')

  // add color bands
  holder
    .selectAll('.bands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', d => {
      return radiusScale(d)
    })
    .lower()
    .attr('fill', d => {
      if (d < 40000) {
        return colorScaleBelow(d)
      } else {
        console.log(d)
        return colorScaleAbove(d)
      }
    })
    .attr('mask', 'url(#births)')

  holder
    .append('text')
    .text('Everyone!')
    .attr('font-size', 30)
    .attr('font-weight', 600)
    .attr('text-anchor', 'middle')
    .attr('dy', -20)

  holder
    .append('text')
    .text('is born at 8am')
    .attr('font-weight', 600)
    .attr('text-anchor', 'middle')

  holder
    .append('text')
    .text('(see Macbeth for details)')
    .attr('text-anchor', 'middle')
    .attr('dy', 20)
}
