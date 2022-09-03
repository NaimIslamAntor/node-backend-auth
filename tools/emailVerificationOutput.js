
/**
 * 
 * @param {string} fName 
 * @param {string} lName 
 * @param {string} verificationToken 
 * @returns {string}
 */

const emailVerificationOutput = (fName, lName, verificationToken) => {
    return `
    <h1>hi ${fName} ${lName}</h1>
    <p>Please <a href="${process.env.API_CALL_ORIGIN}/auth/verifyemail/${verificationToken}">click here</a> to verify your email</P>
    `
}



/**
 * 
 * @param {string} fName 
 * @param {string} lName 
 * @param {string} verificationToken 
 * @returns {string}
 */

 const resetPasswordOutput = (fName, lName, verificationToken) => {
    return `
    <h1>hi ${fName} ${lName}</h1>
    <p>Please <a href="${process.env.API_CALL_ORIGIN}/auth/forgot-password/reset/${verificationToken}">click here</a> to Reset your password</P>
    `
}




module.exports = {emailVerificationOutput, resetPasswordOutput}