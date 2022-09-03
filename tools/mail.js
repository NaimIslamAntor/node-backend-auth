const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')

const {emailVerificationOutput} = require('../tools/emailVerificationOutput')

/**
 * 
 * @param {string} _id 
 * @param {string} fName 
 * @param {string} lName 
 * @param {string} email 
 * @param {string} subject 
 * @param {string} tokenSecret 
 * @param {function} output 
 */

const verificationMail = (_id, fName, lName, email, 
  subject='Email verification', tokenSecret=process.env.EMAIL_VERIFICATION_SECRET, output=emailVerificationOutput) => {


    const verificationTokenPayload = {
        _id
      }

      console.log(verificationTokenPayload)
  
    
      const verificationToken = jwt.sign(verificationTokenPayload, tokenSecret, { expiresIn: '5m' })

 
    // console.log(process.env.EMAIL_VERIFICATION_SECRET)

    console.log(verificationToken)

    const transport = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      });


     // setup email data with unicode symbols
  let mailOptions = {
      from: process.env.MAIL_SEND_EMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
    //   text: 'Hello world?', // plain text body
      html: output(fName, lName, verificationToken) // html body
  };



   // send mail with defined transport object
   transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)  
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info))

})
}






// const verificationMail = (_id, fName, lName, email) => {


//   const verificationTokenPayload = {
//       _id
//     }

//     console.log(verificationTokenPayload)

  
//     const verificationToken = jwt.sign(verificationTokenPayload, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '5m' })


//   console.log(process.env.EMAIL_VERIFICATION_SECRET)

//   console.log(verificationToken)

//   const transport = nodeMailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: process.env.MAIL_PORT,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASSWORD
//       }
//     });


//    // setup email data with unicode symbols
// let mailOptions = {
//     from: process.env.MAIL_SEND_EMAIL, // sender address
//     to: email, // list of receivers
//     subject: 'Email verification', // Subject line
//   //   text: 'Hello world?', // plain text body
//     html: emailVerificationOutput(fName, lName, verificationToken) // html body
// };



//  // send mail with defined transport object
//  transport.sendMail(mailOptions, (error, info) => {
//   if (error) {
//       return console.log(error)
//   }
//   console.log('Message sent: %s', info.messageId)  
//   console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info))

// })
// }


module.exports = { verificationMail }