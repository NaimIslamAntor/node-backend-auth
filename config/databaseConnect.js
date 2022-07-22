const mongoose = require('mongoose')


const connectMongoDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
          })

        console.log(`MongoDB connected to host ${conn.connection.host}`)
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = { connectMongoDB }