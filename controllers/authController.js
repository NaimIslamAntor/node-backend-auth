const jwt = require('jsonwebtoken')
const User = require('../models/User')

const bcrypt = require('bcrypt')

const { verificationMail } = require('../tools/mail')
const verifyTokenValidate = require('../tools/verifyTokenValidate')

const { resetPasswordOutput } = require('../tools/emailVerificationOutput')

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
        return res.status(500).json({errors: [error.message]})
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
        return  res.status(403).json({errors: ['Sorry this token no longer valid!']})
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
        res.status(404).json({errors: ['Sorry this user no longer available']})
    }


}






//changePassword controller
const changePassword = async (req, res) => {

    const { oldPassword, password } = req.body
    const { email } = req.user

    try {

        const user = await User.findOne({email})


        if(!user){
            return res.status(404).json({errors: ['404 User not found']})
        }

        if(!await bcrypt.compare(oldPassword, user.password)){
            return res.status(403).json({errors: ['Old password not matched']})
        }


        const sault = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, sault)

        user.password = hashPassword

        await user.save()

        res.json({message: 'Password successfully changed'})

        
    } catch (error) {
        console.log(error)
        res.staus(500).json({errors: ['Sorry something went wrong with server']})
    }
}



const searchUser = async (req, res) => {
    const { email } = req.query


    if (!email) {
       return res.status(422).json({errors: ['Please type an email first']})
    }


    try {

        const user = await User.findOne({email}).select(['-password',  '-createdAt','-updatedAt', '-password', '-isVerified'])
        
        if(!user){
            return res.status(404).json({errors: ['404 user not found']})
         }
        
        res.json(user)
                
        } catch (error) {
            console.log(error)
            res.status(500).json({errors: ['Sorry something went wrong with server']})
        }
    
}



const sendForgotVerifyEmail = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(422).json({errors: ['something went wrong with email']})
     }


    
     try {

        const user = await User.findOne({email})
        
        if(!user){
            return res.status(404).json({errors: ['404 user not found']})
         }

        const { _id, fName, lName, email:userEmail } = user

        const subject = 'Reset password'
        const tokenSecret = process.env.PASSWORD_RESET_SECRET
        const output = resetPasswordOutput
        
         verificationMail(_id, fName, lName, userEmail, subject, tokenSecret, output)
        
        res.json({message: 'Chech your email reset verification token sent successfully'})
                
        } catch (error) {
            console.log(error)
            res.status(500).json({errors: ['Something went wrong with server']})
        }

     

}


const resetPassword = async (req, res) => {

    const { password } = req.body
    const { resettoken } = req.params
    const tokenSecret = process.env.PASSWORD_RESET_SECRET


    const userId = verifyTokenValidate(resettoken, tokenSecret)

    if (!userId) {
        return res.status(403).json({errors: ['Sorry this token no longer valid!']})
    }


    try {

        const user = await User.findOne({_id: userId})
        
        if(!user){
            return res.status(404).json({errors: ['404 User not found']})
         }


         const sault = await bcrypt.genSalt(12)
         const hashPassword = await bcrypt.hash(password, sault)
 
         user.password = hashPassword

         await user.save()

         res.json({message: 'Password reset succeed!'})
 
    } catch (error) {
        console.log(error)
        res.status(500).json({errors: ['something went wrong in the server']})
    }



}

//userInfo controller
// const userInfo = async (req, res) => {
   
//     const { id } = req.params

//     try {

//         const user = await User.findOne({_id: id}).select(['-password', '-updatedAt'])

//         if(!user){
//             return res.status(404).json({message: '404 User not found'})
//         }

//         res.json(user)

        
//     } catch (error) {
//         console.log(error)
//         res.staus(500).json({message: 'something went wrong in the server'})
//     }
    
// }

module.exports = { 
    register, login,
    resendVerificationEmail, verifyUser,
    changePassword, searchUser,
    sendForgotVerifyEmail, resetPassword
 }