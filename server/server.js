require('./config/config.js')
const _ = require('lodash')
var express = require('express')
var bodyParser = require('body-parser')
var { mongoose } = require('./db/mongoose')
var { ObjectID } = require('mongodb')
// import Model
var { Todo } = require('./models/todo')
var { User } = require('./models/user')
// import Middleware
var { authenticate } = require('./middleware/authenticate')

var app = express()
const PORT = process.env.PORT || 3000

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

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }

        res.send({todo})
    }).catch((e) => {
        res.status(404).send()
    })
   
})

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    // get the id 
    var id = req.params.id

    // validate the id => not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    // remove todo by id
        // success
            // if no doc, send 404
            // if doc, send doc back with 200
        // error
            // 400 with empty body
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }

        res.send({todo})
    }).catch((e) => {
        res.status(400).send()
    })
})

// PATCH /todo/:id
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text','completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }

        res.send({todo})
    }).catch((e) => {
        res.status(404).send()
    })
})

// Create new User
// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user.toJSON())
    }).catch((e) => {
        res.status(400).send(e)
    })
})


// Verify User
// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

// User Login
// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])


    User.findByCredentials(body.email, body.password).then((user) => {
        // Found user .. and Correct Password ... Return Token in header and return user
        var token = user.tokens[user.tokens.length-1].token
        res.header('x-auth', token)
        res.send({user})
    }).catch((e) => {
        res.status(400).send({error: e})
    })
})

// User logout
// DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
    
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, () => {
        res.status(400).send()
    })
})


// START SERVER AT PORT 3000
app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`)
})

module.exports = { app }