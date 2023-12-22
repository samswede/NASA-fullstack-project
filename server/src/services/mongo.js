const mongoose = require('mongoose');

// set up MongoDB connection
// this is from the MongoDB Atlas website, where we created our database
// under the "Connect" button, we chose the driver "Node.js".
// replace the <password> with the password we created for the database user
const password = process.env.MONGO_DATABASE_PASSWORD;
const databaseName = process.env.MONGO_DATABASE_NAME; // will be created if it doesn't exist
const MONGO_URL = `mongodb+srv://samuelandersson:${password}@cluster0.cdvhawq.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

// this is the new way of connecting to MongoDB
mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', (err) => {
	console.error(err);
});


async function mongoConnect() {
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
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};