/*
Ideally, our controller should not be aware of the model.
Meaning it should not know where the how the data is stored.
It should only know what data to return.

This means that the implementation below is not ideal.
Because we have to know that the data is stored in a map.




const { launches } = require('../../models/launches.model');

function getAllLaunches(req, res) {
    //The map objects are not JSON objects.
    //So we need to convert them to JSON objects.

    //The Array.from() method creates a new, shallow-copied Array instance from an array-like or iterable object.
    //map.values is an iterable object.

    //Then we can return the List of launches as a JSON object.
    
    return res.status(200).json(Array.from(launches.values()));
}

module.exports = {
    getAllLaunches,
};

*/

// Instead, we should have a service layer, that is aware of the model.
// And the controller should only be aware of the service layer.
// This is called the separation of concerns.

// We will abstract the data storage away from the controller,
// by putting that access logic into the model.

// Now the map will be an implementation detail that the 
// rest of the application does not need to know about.

const { getAllLaunches,
        scheduleNewLaunch,
        abortLaunchById,
        existsLaunchWithId } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    // Validation
    // If any of the required fields are missing, return a 400 response.
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property.',
        });
    }
    launch.launchDate = new Date(launch.launchDate);

    // Validate date.
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date.',
        });
    }

    //addNewLaunch(launch);
    await scheduleNewLaunch(launch);

    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

   if (!existsLaunchWithId(launchId)) {
       return res.status(404).json({
           error: 'Launch not found.',
       });
   }

    const aborted = abortLaunchById(launchId);

    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};