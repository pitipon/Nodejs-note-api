const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')

var id = '5bdbb05b1af2511ea69b6e51'

// Find all
Todo.find({
    completed: false
}).then((todos) => {
    console.log('Todos', todos)
})

// Find one
Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo)
})

// Find by id
Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id not found')
    }
    console.log('Todo by id', todo)
}).catch( (e) => console.log(e) )