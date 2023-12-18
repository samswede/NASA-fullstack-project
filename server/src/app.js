const express = require('express');
const cors = require('cors');

const planetsRouter = require('./routes/planets/planets.router');

const app = express();

/*
// enable ALL CORS requests.
app.use(cors({
    origin: 'http://localhost:3000',
})); // Enable CORS requests.
*/

// enable CORS requests from ONLY the following origins.
var whitelist = ['http://localhost:3000', 'http://localhost:8000']
var corsOptions = {
    origin: function (origin, callback) {
        console.log('origin: ', origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS.'))
        }
    }
};

app.use(cors(corsOptions));



app.use(express.json());
app.use(planetsRouter);

module.exports = app;