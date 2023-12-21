
const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

// set up MongoDB connection
// this is from the MongoDB Atlas website, where we created our database
// under the "Connect" button, we chose the driver "Node.js".
// replace the <password> with the password we created for the database user
const password = 'testing123';
const databaseName = 'space-explorer'; // will be created if it doesn't exist
const MONGO_URL = `mongodb+srv://samuelandersson:${password}@cluster0.cdvhawq.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const server = http.createServer(app);


/*
This below is a very common node pattern.
We want to make sure that the data is loaded before we start the server.
We will use async/await to do this.

We could be loading a database, or a file, or anything else that takes time to load.
*/

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', (err) => {
	console.error(err);
});

async function startServer() {
    // wait for the database to load
    /* OLD version of mongoose.connect
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    */
   // NEW version of mongoose.connect we don't need to pass in the options anymore
   // it uses the best options by default
    await mongoose.connect(MONGO_URL);

    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
}

startServer();

//const express = require('express');
//const app = express();
//app.listen();
