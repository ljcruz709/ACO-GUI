function update_pheromone(graph, colony, minimize){ //kowing if the objective function is fot minize changes the way to put pheromone
    let path
    for(let i = 0; i < graph.length; i++){
        for(let j = 0; j < graph[i].pheromone.length; j++){
            graph[i].pheromone[j] = 0.85 * graph[i].pheromone[j] //evaporating pheromone before letting ants put more
        }
    }

    for(let j = 0; j < colony.ants.length; j++){
        path = colony.ants[j].path
        for(let i = 1; i < path.length-1; i++){
            let index = graph[path[i-1]].neighborhood.indexOf(path[i]) //explained on evaluate function
            if (minimize)
            {
                graph[path[i-1]].pheromone[index] += 3 / colony.ants[j].cost //adds more pheromone for smallest costs
            }else{
                graph[path[i-1]].pheromone[index] += colony.ants[j].cost / 50 //adds more pheromone for biggest costs
            }
        }
    }

    path = colony.ants[colony.current_top_index].path //adding extra pheromone for the current best solution
    let bonus = 1 / (colony.ants.length / 3) 
    for(let i = 1; i < path.length-1; i++){
        let index = graph[path[i-1]].neighborhood.indexOf(path[i]) //explained on evaluate function
        graph[path[i-1]].pheromone[index] += bonus
    }
    return graph
}

function evaluate(graph, path){ // Finds the total value for a path
    let cost = 0
    for(let i = 1; i < path.length-1; i++){
        let index = graph[path[i-1]].neighborhood.indexOf(path[i]) //indexOf returns the position in the list for the node wanted to be edge's target
        cost += graph[path[i-1]].costs[index]
    }

    return cost
}

function iterate(graph, params){
    colony = {  //object that stores the output data
        ants : [],
        current_top_index : 0
    }

    for(let ant = 0; ant < params.ants_per_iteration; ant++){ // sends ants
        let visited_list = [0]
        let current_node = 0
        let visibility = 0.0
        let probabilities = []
        let sum = 0
        let avaiable_neighbors = 0
        do{
            probabilities = []
            sum = 0;
            
            avaiable_neighbors = graph[current_node].neighborhood_size // we asume all neighbors are avaiable until we check for them
            for(let target = 0; target < graph[current_node].neighborhood_size; target++){ //iterates trouht all the posible targets an ant can take from current node
                visibility = 1 / graph[current_node].costs[target] // a measure of how "close" is the target 
                let p = Math.pow(visibility, params.alpha) * Math.pow(graph[current_node].pheromone[target], params.beta) 
                //alpha and beta determine how considerated is visibility and pheromone (respectively) bay an ant for chosing a target to go
                probabilities.push(p)
                let exist  = visited_list.indexOf(graph[current_node].neighborhood[target]) // checks for the target in the visited list to know if it has to be ignored
                if(exist === -1){
                    sum = sum + p // this sum will help to "normalize" probabilites after randomly chosing a target
                }else{
                    avaiable_neighbors-- //in case there are no more avaiable neighbors to go, the ant has it's path done
                }
            }

            for(let i = 0; i < probabilities.length; i++){
                probabilities[i] = probabilities[i] / sum //normalizing probabilities
            }
            let prob = Math.random() // throwing a random
            sum = 0 //the sum to control the "roulette"
            let i = 0; 
            while(sum < prob && i<graph[current_node].neighborhood_size){
                if(visited_list.indexOf(graph[current_node].neighborhood[i]) === -1 ){ //checking that current target is not visited yet
                   sum = sum + probabilities[i] //if the sum reaches or overpases the random, the "ruolette pointed" to this target 
                }
                i++ 
            }
            current_node = graph[current_node].neighborhood[i-1] // i-1 becouse even after "stoping" roullete the index is inremented one more time
            visited_list.push(current_node) // adding the chosen target to the path
        }while (avaiable_neighbors > 0)
    //  console.log (visited_list)
        colony.ants.push({ //saving the path of this ant to the colony (this will be used to update graph's pheromone and is the output for this iteration)
            path : visited_list,
            cost : evaluate(graph, visited_list)
        })
        if(params.minimize){ //finding the best solution for this iteration
            if(colony.ants[colony.current_top_index].cost > colony.ants[ant].cost){
                colony.current_top_index = ant;
            }
        }else{
            if(colony.ants[colony.current_top_index].cost < colony.ants[ant].cost){
                colony.current_top_index = ant;
            }
        }
    }
    console.log(colony.ants[colony.current_top_index])
    graph = update_pheromone(graph,colony,params.minimize)
    return graph
}



///////////////////////////////// from here starts the code to run the algorithm
const Fs = require('fs');

const tmp = JSON.parse(Fs.readFileSync('activities-graph/graph.json')); //graph.json saves the graph geterated from the activities list
const params = JSON.parse(Fs.readFileSync('parameters.json')); //parameters.json gets the parameters from the GUI
////////////////////////////////////////////////// up here just getting parameters from files

let graph = [] // the better data structure for representing a graph in this algorithm will be stored here
let count = 0 //helps to concatenate each node's ID stablished in activities-graph.json 

tmp["nodes"].forEach(node => { //each node stores a list of nodes that can be reached from it (neighborhood), the cost, and the pheromone stored on the edge
    let tmp2 = {}
    tmp2.neighborhood_size = 0
    tmp2.neighborhood = []
    tmp2.costs = []
    tmp2.pheromone = []
    tmp["edges"].forEach(edge => { //fill up the lists
        if (edge.source === ("n" + parseInt(count))){
            tmp2.costs.push(edge.weight) 
            tmp2.neighborhood.push(parseInt(edge.target[1]))
            tmp2.neighborhood_size = tmp2.neighborhood_size + 1 //incrementing neighborhood size
            tmp2.pheromone.push(params.initial_pheromone) // putting the deafault amount of pheromone before starting
        }
    })
    graph.push(tmp2) //adding builded node to graph
    count = count + 1
})


for(let i = 0; i<10; i++){  //just for testing
    graph = iterate(graph, params)    
 //   console.log(graph) //uncomment to see pheromone
}
/*
let a = [1, 2,5]
console.log(a.indexOf(3))*/
