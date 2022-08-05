const jwt = require('jsonwebtoken')

//protect routes that need authentication
const protect = (req, res, next) => {
   
    const authorization = req.headers.authorization


    if(!authorization){
        return res.status(403).json({message: 'Sorry you are not authorize to do that'})
    }


    if(!authorization.startsWith('Bearer')){
        return res.status(403).json({message: 'Sorry token type not supported'})
    }


    const token = authorization.split(' ')[1]



    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({message: 'Sorry you are not authorize to do that'})
        }

        req.user = user

       next()

    })


}


//isVerified checks for verified user - make sure you run after protect middleware
const isUserVerified = (req, res, next) => {
    const { isVerified } = req.user

    if (!isVerified) {
        return res.status(403).json({message: 'Please verify your email first'})
    }

    next()
}



//isVerified checks for verified user - make sure you run after protect middleware
const isUserNotVerified = (req, res, next) => {
    const { isVerified } = req.user

    if (isVerified) {
        return res.status(403).json({message: 'You are already a verified user'})
    }

    next()
}



module.exports = { protect, isUserVerified, isUserNotVerified }