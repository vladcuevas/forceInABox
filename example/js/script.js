/* global d3, forceInABox */
import { Reader } from './models/reader.js'
let reader = new Reader('data/miserables.json')

let useGroupInABox = false

let drawTemplate = false

let template = 'force'

d3.select('#checkGroupInABox').property('checked', useGroupInABox)
d3.select('#checkShowTreemap').property('checked', drawTemplate)
d3.select('#selectTemplate').property('value', template)

let width = 600

let height = 400

let color = d3.scaleOrdinal(d3.schemeCategory10)

let force = d3.forceSimulation()
  .force('charge', d3.forceManyBody())
  .force('x', d3.forceX(width / 2).strength(0.05))
  .force('y', d3.forceY(height / 2).strength(0.05))

let svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)

let rawDS = reader.JSON();

(async function read () {
  const graph = await rawDS

  let groupingForce = forceInABox()
    .strength(0.2) // Strength to foci
    .template(template) // Either treemap or force
    .groupBy('group') // Node attribute to group
    .links(graph.links) // The graph links. Must be called after setting the grouping attribute
    .enableGrouping(useGroupInABox)
    .nodeSize(4)
    .linkStrengthIntraCluster(0.01)
    .size([width, height]) // Size of the chart
  force
    .nodes(graph.nodes)
    .force('group', groupingForce)
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink(graph.links)
      .distance(10)
      .strength(groupingForce.getLinkStrength)
    )

  let link = svg.selectAll('.link')
    .data(graph.links)
    .enter().append('line')
    .attr('class', 'link')
    .style('stroke-width', d => Math.sqrt(d.value))

  let node = svg.selectAll('.node')
    .data(graph.nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .attr('r', 5)
    .style('fill', d => color(d.group))
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))

  node.append('title')
    .text(function (d) { return d.name })

  force.on('tick', function () {
    link.attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })

    node.attr('cx', function (d) { return d.x })
      .attr('cy', function (d) { return d.y })
  })

  d3.select('#checkGroupInABox').on('change', onCheckGroupInABox)

  d3.select('#selectTemplate').on('change', function () {
    template = d3.select('#selectTemplate').property('value')
    force.stop()
    force.force('group').template(template)
    force.alphaTarget(0.5).restart()
  })

  d3.select('#checkShowTreemap').on('change', function () {
    drawTemplate = d3.select('#checkShowTreemap').property('checked')
    if (drawTemplate) {
      force.force('group').drawTemplate(svg)
    } else {
      force.force('group').deleteTemplate(svg)
    }
  })

  setTimeout(function () {
    d3.select('#checkGroupInABox').property('checked', true)
    onCheckGroupInABox()
  }, 2000)
})()

function dragstarted (d) {
  if (!d3.event.active) force.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged (d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragended (d) {
  if (!d3.event.active) force.alphaTarget(0)
  d.fx = null
  d.fy = null
}

function onCheckGroupInABox () {
  force.stop()
  useGroupInABox = d3.select('#checkGroupInABox').property('checked')
  force
  // .force("link", d3.forceLink(graph.links).distance(50).strength(
  // function (l) { return !useGroupInABox? 0.7 :
  //     l.source.group!==l.target.group ? 0 : 0.1;
  // }))
    .force('group').enableGrouping(useGroupInABox)

  force.alphaTarget(0.5).restart()
}
