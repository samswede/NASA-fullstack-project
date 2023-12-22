// import the built-in middleware.
const path = require('path');
const express = require('express');

// import 3rd party middleware.
const cors = require('cors');
const morgan = require('morgan');

// import own api router.
const api = require('./routes/api');


// create the express app.
const app = express();


// enable ALL CORS requests.
app.use(cors({
    origin: 'http://localhost:3000',
})); // Enable CORS requests.

/*
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
*/

// logging usng morgan, using the 'combined' format.
const morganSetting = 'combined' // 'dev' or 'tiny' or 'common' or 'combined'
app.use(morgan(morganSetting));


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// mount the v1 of api router.
app.use('/v1', api);

// mount the root route.
/* NOTE: 
    This is mounting the public/index.html file, which
    is the React app after it has been built.
    We want to serve this file at the '/' route,
    rather than the '/index.html' route.

    We also include '*' as the route, so that any
    route that is not matched by the other routes
    will be matched by this route, and the index.html
    file will be served.

    This is important, because we want to serve the
    index.html file for all routes that are not
    matched by the other routes, so that the React
    app can handle those routes.
*/
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


module.exports = app;