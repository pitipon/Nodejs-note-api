const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

// REMOVE ALL
Todo.remove({ text: "Hello world"}).then((result) => {
    console.log(result)
})

// FIND and Remove ONE
Todo.findOneAndRemove({ text: "Hello world"}).then((result) => {
    console.log(result)
})

// FIND BY ID and REMOVE
Todo.findByIdAndRemove('5bdbd6691fbf08274ad5d96f').then((result) => {
    console.log(result)
})