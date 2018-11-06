var mongoose = require('mongoose')

// CONFIG MONGOOSE
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)



module.exports = {
    mongoose
}