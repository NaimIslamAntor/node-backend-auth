const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')

const emailVerificationOutput = require('../tools/emailVerificationOutput')

const sendVerificationEmail = (req, res) => {
    const { fName, lName, email, isVerified, rememberToken } = req.user

    const tokenPayload = {
        fName,
        lName,
        isVerified,
        email,
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '180d' })

    tokenPayload.token = token

  //   const output = `
  //   <p>Test email</p>
  //   <h3>Contact Details</h3>
  //   <ul>  
  //     <li>Name: ${fName}</li>
  //     <li>Company: ${lName}</li>
  //     <li>Email: ${email}</li>

  //   </ul>

  // `;



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
      subject: 'Email verification', // Subject line
    //   text: 'Hello world?', // plain text body
      html: emailVerificationOutput(fName, lName, rememberToken) // html body
  };



   // send mail with defined transport object
   transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));

    res.status(201).json(tokenPayload);
});



}


module.exports = { sendVerificationEmail }