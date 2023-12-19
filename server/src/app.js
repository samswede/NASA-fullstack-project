// import the built-in middleware.
const path = require('path');
const express = require('express');

// import 3rd party middleware.
const cors = require('cors');
const morgan = require('morgan');

// import the routers.
const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

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

// mount the routers. 
/* NOTE:
        It does not matter what order we mount the routers.
        Because they will be matching against different routes,
        under different paths, so it doesn't matter which order
        we mount them in, relative to each other.

        Important part is we set up the routes correctly in the
        routers themselves.
*/

app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

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