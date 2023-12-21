/*
This is a schema for the launches collection in the Mongo database.
A schema is a way to describe the structure of the data.


*/

const mongoose = require('mongoose');

/*
!!! IMPORTANT !!!
We can use references to other collections in our schema.
For example, we can reference the planets collection in the launches collection.

Thats what you see in the target property below.

target: {
    type: mongoose.ObjectId,
    ref: 'Planet',
},


This is a very common pattern in MongoDB, and it's called "referencing".

But the truth is that it's not a good pattern.
It makes our life harder, and it makes our queries slower.

*/

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },

    launchDate: {
        type: Date,
        required: true
    },

    mission: {
        type: String,
        required: true
    },

    rocket: {
        type: String,
        required: true
    },

    //customers: [String],

    target: {
        type: String,
        required: true,
        default: 'Earth'
    },

    upcoming: {
        type: Boolean,
        required: true,
        default: true
    },

    success: {
        type: Boolean,
        required: true,
        default: true
    },
});
