const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

// User Schema
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

// Filter result of user only "_id" and "email"
UserSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

// Methods to generate token
// methods are defined on the document (instance).
UserSchema.methods.generateAuthToken = function () {
    var user = this
    var access = 'auth'
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

    user.tokens = {access, token}

    return user.save().then(() => {
        return token
    })
}

// User Methods to verify token
// statics are the methods defined on the Model.
UserSchema.statics.findByToken = function (token) {
    var User = this
    var decoded

    try {
        decoded = jwt.verify(token, 'abc123')
    } catch (e) {
        return new Promise((resolve, reject) => {
            reject('Not Verify token')
        })
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

// User .. Find by credentials
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this

    return User.findOne({email}).then((user) => {
        if (!user) {
            return new Promise((resolve, reject) => {
                reject('Cannot find User')
            })
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt compare password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                } else {
                    reject('Password not match')
                }
            })
        })

    })
}

// Bcrypt in Mongoose Middleware
// to change plain password to bcrypt password
UserSchema.pre('save', function (next) {
    var user = this
    console.log('Mongoose Middlware')
    // Modified in document 'password'
    if (user.isModified('password')) {
        // user.password = hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                // console.log(33333, hash)
                user.password = hash
                // console.log(323232, user)
                next()
            })
        })
    } else {
        next()
    }
})

// Define User model from UserSchema
var User = mongoose.model('User', UserSchema)

// Export User model
module.exports = { User }
