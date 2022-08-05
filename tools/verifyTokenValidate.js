const jwt = require('jsonwebtoken')

const verifyTokenValidate = verifyToken => {

    console.log(verifyToken)
    
    return jwt.verify(verifyToken, process.env.EMAIL_VERIFICATION_SECRET, (err, id) => {

        console.log(process.env.EMAIL_VERIFICATION_SECRET)

        if (err) {
            // console.log(err)
            console.log(err.message)
            return false
        }

        console.log(id)
        return id._id
    })

  
}



module.exports = verifyTokenValidate