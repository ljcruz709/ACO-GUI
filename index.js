const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const port = '8380'
const messagePort = `Server started on http://localhost: ${port}`

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

app.listen(port, function () {
    console.log(messagePort)
})