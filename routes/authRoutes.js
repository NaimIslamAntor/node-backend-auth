//import
const express = require('express')
const { register, login } = require('../controllers/authController')
const { validationOnRegister, validationOnLogin } = require('../middlewares/validationOnAuth')
const { sendVerificationEmail } = require('../middlewares/sendVerificationEmail')
//define
const router = express.Router()



router.post('/register', validationOnRegister, register, sendVerificationEmail)

router.post('/login', validationOnLogin, login)



module.exports = router