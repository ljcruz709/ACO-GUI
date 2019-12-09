const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const port = '8380'
const messagePort = `Server started on http://localhost:${port}`

const app = express()

const pathClient = 'views/'

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(path.join(__dirname, pathClient)))

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/views/js')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
    }
})

let upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.send(index)
})

app.post('/', (req, res) => {
    let obj = {
        initial_pheromone: 0,
        ants_per_iteration: 0,
        max_iterations: 0,
        minimize: false
    }

    obj["initial_pheromone"] = req.body["initial_pheromone"]
    obj["ants_per_iteration"] = req.body["ants_per_iteration"]
    obj["max_iterations"] = req.body["max_iterations"]
    obj["minimize"] = req.body["minimize"]

    const tmp = JSON.parse(fs.readFileSync(__dirname + '/views/js/graph.json'))

    let graph = []
    let count = 0

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


    res.send(graph)
})

app.post('/json', upload.single('graph.json'), (req, res, next) => {

    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return res.send({ "status_file": false })
    }
    console.log(file)
    res.send({ "status_file": true })
})

app.listen(port, function () {
    console.log(messagePort)
})