const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3005;
const https = require('https');
const mongoose = require('mongoose');
const DB_URI = require('./config/dbconfig');
const uri = require('./config/dbconfig');
const dotenv = require('dotenv').config()
const fs = require('fs');
const cors = require('cors');
const userRoutes = require('./routes/user');
const teaRoutes = require('./routes/tea');
const logRoutes = require('./routes/log');

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/tea', teaRoutes);
app.use('/log', logRoutes);

// DB connection
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) console.log(err)
    else console.log('Connected to the database')
})
console.log(uri)
app.get('/', (req, res) => res.send('Hellow World!'));


app.listen(port, () => console.log(`http://localhost:${port}/`));