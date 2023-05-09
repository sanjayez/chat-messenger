require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRoutes = require('./Routes/userRoutes');

const app = express()
app.use('/login', userRoutes)

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`))