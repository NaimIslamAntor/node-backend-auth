// import packages
require('dotenv').config()
const express = require('express')

const cors = require('cors')

const { connectMongoDB } = require('./config/databaseConnect')

//import routes
const authRoutes = require('./routes/authRoutes')

//initialization
const app = express()

const corsOptions = {
    origin: process.env.API_CALL_ORIGIN,
  }

app.use(express.json())
app.use(cors(corsOptions))

//some vars
const port = process.env.PORT || 5000

//DB connection
connectMongoDB()

//register routes
app.use('/api/auth', authRoutes)

app.get('', (req, res) => {
    res.send('Server started successfully')
})

//start the server
app.listen(port, () => console.log(`server running on port ${port}`))