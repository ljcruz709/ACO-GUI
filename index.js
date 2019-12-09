const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const port = '8380'
const messagePort = `Server started on http://localhost:${port}`

const app = express()

const pathClient = 'views/'

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.static(path.join(__dirname, pathClient)))

app.get('/', (req, res) => {
    res.send(index)
})

app.post('/', (req, res) => {
    let obj = {
        initial_pheromone : 0,
        ants_per_iteration: 0,
        max_iterations : 0
    }

    obj["initial_pheromone"] = req.body["initial_pheromone"]
    obj["ants_per_iteration"] = req.body["ants_per_iteration"]
    obj["max_iterations"] = req.body["max_iterations"]
    
    console.log(req.body)
    res.send(obj)
})

app.post('/json', (req, res) => {
    /*
    let body = ''
    filePath = __dirname + 'js/graph.js'
    req.on('data', function(data) {
        body += data
    })

    req.on('end', function (){
        fs.appendFile(filePath, body, function() {
            res.send({"status": "Archivo añadido correctamente"})
        })
    })*/
    console.log(req)
    res.send({"status": "Archivo añadido correctamente"})
})

app.listen(port, function () {
    console.log(messagePort)
})