var env = process.env.NODE_ENV || 'development'
console.log('env *******', env)

// if (env === 'development') {
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
//     // var mongoPassword = process.env.MONGODBPASSWORD || ''
//     // process.env.MONGODB_URI = `mongodb+srv://mo:${mongoPassword}@qrrice-fmwoi.azure.mongodb.net/TodoApp?retryWrites=true`
// } else if (env === 'test') {
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
// }

if (env ==='development' || env === 'test') {
    var config = require('./config.json')
    var envConfig = config[env]

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key]
    })
}