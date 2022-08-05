const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')



const Schema = mongoose.Schema

const user = new Schema({
  fName: {
    type: String,
    required: true
  },
  lName: {
      type: String,
      required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },

  isVerified:{
    type: Boolean,
    default: false,
  }
 
},
{
    timestamps: true,
});

//hash password and hash token before storing
// user.pre('save', async function(){

//   //gen sault
//   const sault = await bcrypt.genSalt(12)

//   //hash password
//   const hashPassword = await bcrypt.hash(this.password, sault)
//   this.password = hashPassword
// })

mongoose.models = {};

const User = mongoose.model('users', user);

module.exports = User