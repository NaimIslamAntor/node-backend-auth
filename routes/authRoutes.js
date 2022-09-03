//import
const express = require('express')
const rateLimit = require('express-rate-limit')

const { register, login, resendVerificationEmail, verifyUser, changePassword, searchUser, sendForgotVerifyEmail, resetPassword } = require('../controllers/authController')
const { validationOnRegister, validationOnLogin, validationOnPasswordChange, validationOnPasswordReset } = require('../middlewares/validationOnAuth')

const { sendVerificationEmail } = require('../middlewares/sendVerificationEmail')
const { protect, isUserNotVerified, isUserVerified } = require('../middlewares/protect')

//rate limit 
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 1, // Limit each IP to 1 requests per `window` (here, per 5 minutes)
})



//define
const router = express.Router()



router.post('/register', validationOnRegister, register, sendVerificationEmail)

router.post('/login', validationOnLogin, login)

router.post('/resendverificationemail', limiter, protect, isUserNotVerified, resendVerificationEmail)

router.put('/verifyemail/:verifyToken', protect, isUserNotVerified, verifyUser)

router.patch('/password-change', protect, isUserVerified, validationOnPasswordChange, changePassword)

router.get('/forgot-password/search', searchUser)

router.post('/forgot-password/sendforgot/verify', limiter, sendForgotVerifyEmail)


router.patch('/forgot-password/reset/:resettoken', validationOnPasswordReset, resetPassword)


// router.get('/profile/:id', protect, userInfo)



module.exports = router