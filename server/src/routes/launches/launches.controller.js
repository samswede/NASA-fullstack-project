const { launches } = require('../../models/launches.model');

function getAllLaunches(req, res) {
    /*
    The map objects are not JSON objects.
    So we need to convert them to JSON objects.

    The Array.from() method creates a new, shallow-copied Array instance from an array-like or iterable object.
    map.values is an iterable object.

    Then we can return the List of launches as a JSON object.
    */
    return res.status(200).json(Array.from(launches.values()));
}

module.exports = {
    getAllLaunches,
};