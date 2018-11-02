var express = require('express')
var bodyParser = require('body-parser')
var { mongoose } = require('./db/mongoose')
// import Model
var { Todo } = require('./models/todo')
var { User } = require('./models/user')

var app = express()

app.use(bodyParser.json());

// POST /todos
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

// GET /todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e)
    })
})

// START SERVER AT PORT 3000
app.listen(3000, () => {
    console.log('Started on port 3000')
})

module.exports = { app }