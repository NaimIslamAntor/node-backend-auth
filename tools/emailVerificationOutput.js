

const emailVerificationOutput = (fName, lName, rememberToken) => {
    return `
    <h1>hi ${fName} ${lName}</h1>
    <p>Please <a href="${process.env.API_CALL_ORIGIN}/auth/verifyemail/${rememberToken}">click here</a></P>
    `
}



module.exports = emailVerificationOutput