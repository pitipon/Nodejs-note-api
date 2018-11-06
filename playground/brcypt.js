const bcrypt = require('bcryptjs')

var password = '123abc!'

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log('Hash ', hash)
//     })
// })

var hashedPassword = '$2a$10$n3V.EjHOGjf0TviRI59GYewEaFT006g1UakUHMm6tGls7FCyusFEO'

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res)
})