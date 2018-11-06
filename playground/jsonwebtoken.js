const jwt = require('jsonwebtoken')

var data = {
    id: 10
}

var token = jwt.sign(data, 'saltpassword')

console.log('JWT Token ', token)

var decoded = jwt.verify(token, 'saltpassword')
console.log('Decoded ', decoded)