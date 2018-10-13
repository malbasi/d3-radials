import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 450 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Scales 
let radius = 170

let radiusScale = d3
  .scaleLinear()
  .domain([0, 10])
  .range([0, radius])

var angleScale = d3
  .scaleBand()
  .range([0, Math.PI * 2])

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // only select the first player from our data
  let player = datapoints[0]

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let customDatapoints = [
    { name: 'minutesPlayer', value: player.MP },
    { name: 'points', value: player.PTS },
    { name: 'fieldGoals', value: player.FG },
    { name: '3Pointers', value: player['3P'] },
    { name: 'freeThrows', value: player.FT },
    { name: 'rebounds', value: player.TRB },
    { name: 'assists', value: player.AST },
    { name: 'steals', value: player.STL },
    { name: 'blocks', value: player.BLK }
  ]

  // add categories to the angle scale domain
  var categories = customDatapoints.map(d => d.name)
  angleScale.domain(categories)

  // add the scale lines
  let bands = [2, 4, 6, 8, 10]
  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => {
      return radiusScale(d)
    })
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('cx', 0)
    .attr('cy', 0)
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
    .attr('y', -radiusScale(10))
    .attr('dy', -10)
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
}
