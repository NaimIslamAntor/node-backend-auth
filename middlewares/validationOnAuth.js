//import
const bcrypt = require('bcrypt')
const User = require('../models/User')


//validate on register
const validationOnRegister = async (req, res, next) => {

    const { fName, lName, email, password, confirmPassword } = req.body

    const errors = []


    if (!fName) {
        errors.push('First name is required')
    }


    if (!lName) {
        errors.push('Last name is required')
    }


    if (!email) {
        errors.push('Email address is required')
    }


    if (!password) {
        errors.push('Password is required')
    }else if (password.length < 6) {
        errors.push('Password must be at least 6 character long')
    }

    if (!confirmPassword) {
        errors.push('Confirm Password is required')
    }

    if(await User.findOne({email})){
        errors.push('User exists with that email try a different one')
    }



    if (password !== confirmPassword) {
        errors.push('Password and confirm password not matched')
    }


    if (errors.length > 0) {
        return res.status(422).json({errors})
    }

    next()
}


//validate on login

const validationOnLogin = async (req, res, next) => {

    const { email, password } = req.body

    const errors = []



    if (!email) {
        errors.push('Email address is required')
    }


    if (!password) {
        errors.push('Password is required')
    }

    if (!email || !password) {
        return res.status(422).json({errors})
    }

    let user = await User.findOne({email})


    
    if(!user){
        errors.push('User does not exist register first')
    }else if(user){

        req.user = user
        
        if(!await bcrypt.compare(password, user.password)){
            errors.push('User password not matched')
        }

    }    


    if (errors.length > 0) {
        return res.status(422).json({errors})
    }

    next()
}



//validate on register
const validationOnPasswordChange = (req, res, next) => {

    const { oldPassword, password, confirmPassword } = req.body

    const errors = []


    if (!oldPassword) {
        errors.push('Old password is required')
    }

    if (!password) {
        errors.push('Password is required')
    }else if (password.length < 6) {
        errors.push('Password must be at least 6 character long')
    }

    if (!confirmPassword) {
        errors.push('Confirm Password is required')
    }


    if (password !== confirmPassword) {
        errors.push('Password and confirm password not matched')
    }


    if (errors.length > 0) {
        return res.status(422).json({errors})
    }

    next()
}



//validate on register
const validationOnPasswordReset = (req, res, next) => {

    const { password, confirmPassword } = req.body

    const errors = []


    if (!password) {
        errors.push('Password is required')
    }else if (password.length < 6) {
        errors.push('Password must be at least 6 character long')
    }

    if (!confirmPassword) {
        errors.push('Confirm Password is required')
    }


    if (password !== confirmPassword) {
        errors.push('Password and confirm password not matched')
    }


    if (errors.length > 0) {
        return res.status(422).json({errors})
    }

    next()
}


module.exports = { validationOnRegister, validationOnLogin, validationOnPasswordChange, validationOnPasswordReset }