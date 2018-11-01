var mongoose = require('mongoose')

// CONFIG MONGOOSE
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

module.exports = {
    mongoose
}