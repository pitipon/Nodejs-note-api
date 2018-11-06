var { User } = require('./../models/user')

// Middleware - Authenticate by Token
var authenticate = (req, res, next) => {
    var token = req.header('x-auth')

    User.findByToken(token).then((user) => {

        // if user does not exist
        if (!user) {
            res.status(401).send({ error: 'User Does not Exist' })
        }

        req.user = user
        req.token = token
        next()
    }).catch((e) => {
        res.status(401).send({ error: e })
    })
}

module.exports = { authenticate }