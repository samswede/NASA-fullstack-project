// Why are we using a map instead of an array?
// https://stackoverflow.com/questions/500504/why-use-a-map-over-an-object-in-javascript
// 

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: latestFlightNumber,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

// How do we add a new launch to our map?
// We use the set method.
// map.set(key, value); where key is the flightNumber and value is the launch object.
// In a map, the key can be any data type, not just a string.
// In this case, the key is the flightNumber, which is a number.
// But it could be a string, an object, an array, or even a function!
// Same goes for the value. It can be any data type.
launches.set(launch.flightNumber, launch);


function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

function abortLaunchById(launchId) {
    /*
    We could have done
    launches.delete(launchId);
    but we are in the era of big data and machine learning.
    We want to keep the data for future analysis.
    So we will just update the launch object.
    */
    const aborted = launches.get(launchId);

    aborted.upcoming = false;
    aborted.success = false;

    return aborted;
}

// This abstraction is not necessary, but it is a good practice.
// This way, the rest of the application does not need to know about the map.
// We can just return the values of the map as an array.
// The Array.from() method creates a new, shallow-copied Array instance from an array-like or iterable object.
// map.values is an iterable object.
// Then we can return the List of launches as a JSON object.
function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    /*
    We want to minimise the amount of data that is exposed to the outside world.
    We want the client not to have to worry about the flightNumber, for example.
    We want to hide the implementation details from the client.

    So we will assign the flightNumber in the server, not the client.
    As well as other fields that can be derived from the data or context.

    In this case, that includes the flightNumber, the upcoming field, and the success field, and the customers field.
    */

    latestFlightNumber++; // increment the flight number by 1.
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            flightNumber: latestFlightNumber,
            upcoming: true,
            customers: ['ZTM', 'NASA'],
            success: true,
        })
    );
}

module.exports = {
    existsLaunchWithId,
    abortLaunchById,
    getAllLaunches,
    addNewLaunch,
    
}; 