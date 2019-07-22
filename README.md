forceInABox.js
==============

Updated for **d3.v5**

A d3.js v5 force that implements the [Group-in-a-box](http://hcil2.cs.umd.edu/trs/2011-24/2011-24.pdf) layout algorithm to distribute nodes in a network according to their clusters. The algorithm uses a treemap or a force diagram to compute focis that are later used to distribute each cluster into it's own box.

To use it just add the forceInABox as another force in your simulation and make sure your other forces don't overpower it. *Check the Example from the example folder*

*a note on input data format:* **forceInABox** expects a graph object, with a `links` array that contains `link` objects with `source` and `target` properties. the values of the `source` and `target` properties should refer to the index value of the source or target node. [example of this node-index convention](https://gist.github.com/john-guerra/830e536314436e2c6396484bcc1e3b3d#file-miserables-json)