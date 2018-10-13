import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 400 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// additional data

let bands = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

// scales
let radius = 170

let radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

var angleScale = d3
  .scaleBand()
  .range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(d.score))
  .angle(d => angleScale(d.category))

d3.csv(require('./data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  var category = datapoints.map(d => d.category)
  angleScale.domain(category)

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // draw the radar shape
  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'red')
    .attr('opacity', 0.5)
    .attr('stroke', 'black')

  // add the scale lines
  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  // add the center circle
  holder
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 2)
    .lower()

  // add the labels
  holder
    .selectAll('.angle-text')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', -radiusScale(5))
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })

  // add the radial lines
  holder
    .selectAll('.radial-lines')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('stroke-width', 1)
    .attr('stroke', 'lightgrey')
    .lower()

  //
}
