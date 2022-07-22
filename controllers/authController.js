const jwt = require('jsonwebtoken')
const User = require('../models/User')

//register controller
const register = async (req, res, next) => {

    const { fName, lName, email, password } = req.body


    try {
        
    const user = await User.create({
        fName,
        lName,
        email,
        password,
        rememberToken: email + password
    })


    req.user = user
    next()

    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}


//login controller
const login = (req, res) => {

 
    const { fName, lName, email, isVerified, rememberToken } = req.user


    const tokenPayload = {
        fName,
        lName,
        isVerified,
        email,
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '180d' })
    tokenPayload.token = token

    res.json(tokenPayload)

}



module.exports = { register, login }