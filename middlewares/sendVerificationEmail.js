const jwt = require('jsonwebtoken')
// const nodeMailer = require('nodemailer')

const { verificationMail } = require('../tools/mail')

const sendVerificationEmail = (req, res) => {
    const { _id, fName, lName, email, isVerified } = req.user

    //payload for auth token
    const tokenPayload = {
        _id,
        fName,
        lName,
        isVerified,
        email,
    }

    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '180d' })
    tokenPayload.token = token

    verificationMail(_id, fName, lName, email)


    res.status(201).json(tokenPayload);



}


module.exports = { sendVerificationEmail }