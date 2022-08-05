const jwt = require('jsonwebtoken')
const User = require('../models/User')

const bcrypt = require('bcrypt')

const { verificationMail } = require('../tools/mail')
const verifyTokenValidate = require('../tools/verifyTokenValidate')

//register controller
const register = async (req, res, next) => {

    const { fName, lName, email, password } = req.body


    try {


    const sault = await bcrypt.genSalt(12)

    //hash password
    const hashPassword = await bcrypt.hash(password, sault)
        
    const user = await User.create({
        fName,
        lName,
        email,
        password: hashPassword,
    })


    req.user = user
    next()

    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}


//login controller
const login = (req, res) => {

 
    const { _id, fName, lName, email, isVerified } = req.user


    const tokenPayload = {
        _id,
        fName,
        lName,
        isVerified,
        email,
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '180d' })
    tokenPayload.token = token

    res.json(tokenPayload)

}


//resendVerificationEmail controller

const resendVerificationEmail = (req, res) => {
    const { _id, fName, lName, email } = req.user
    verificationMail(_id, fName, lName, email)

    res.json({message: 'Email successfully sent check your mail'})
}



//verifyUser controller

const verifyUser = async (req, res) => {

    const { verifyToken } = req.params

    const userId = verifyTokenValidate(verifyToken)

    if (!userId) {
        return  res.status(403).json({message: 'Sorry this token no longer valid!'})
    }

   
    try {
        const user = await User.findById(userId)

        user.isVerified = true
        await user.save()
        

        const { fName, lName, email, isVerified } = user


        const tokenPayload = {
            fName,
            lName,
            isVerified,
            email,
        }
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '180d' })

        const response = {
            isVerified,
            token
        }

        res.json(response)
    
    } catch (error) {
        console.log(error.message)
        // res.status(500).json({message: error.message})
        res.status(404).json({message: 'Sorry this user no longer available'})
    }


}






//changePassword controller
const changePassword = async (req, res) => {

    const { password, confirmPassword } = req.body
    const { email } = req.user

    try {

        const user = await User.findOne({email})


        if(!user){
            return res.status(404).json({message: '404 User not found'})
        }

        const sault = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, sault)

        user.password = hashPassword

        await user.save()

        res.status(204).end()

        
    } catch (error) {
        console.log(error)
        res.staus(500).json({message: 'something went wrong in the server'})
    }
}

module.exports = { register, login, resendVerificationEmail, verifyUser, changePassword }