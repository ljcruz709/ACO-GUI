const Fs = require('fs');

const tmp = JSON.parse(Fs.readFileSync('activities-graph/graph.json')); //graph.json saves the graph geterated from the activities list
const preguntas = JSON.parse(Fs.readFileSync('parameters.json')); //parameters.json gets the parameters from the GUI

let graph = []
let count = 0
//console.log("n" + parseInt(1))

tmp["nodes"].forEach(node => {
    let tmp2 = {}
    tmp2.neighborhood_size = 0
    tmp2.neighborhood = []
    tmp2.costs = []
    tmp["edges"].forEach(edge => {
        if (edge.source === ("n" + parseInt(count))){
            tmp2.costs.push(edge.weight)
            tmp2.neighborhood.push(parseInt(edge.target[1]))
            tmp2.neighborhood_size = tmp2.neighborhood_size + 1
        }
    })
    graph.push(tmp2)
    count = count + 1
})

console.log(graph)