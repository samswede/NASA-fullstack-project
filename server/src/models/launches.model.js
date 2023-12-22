// Why are we using a map instead of an array?
// https://stackoverflow.com/questions/500504/why-use-a-map-over-an-object-in-javascript
// 
const launches = require('./launches.mongo');

// this is just used for validation
const planets = require('./planets.mongo');


//let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: DEFAULT_FLIGHT_NUMBER,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);
/*
const launches = new Map();
// How do we add a new launch to our map?
// We use the set method.
// map.set(key, value); where key is the flightNumber and value is the launch object.
// In a map, the key can be any data type, not just a string.
// In this case, the key is the flightNumber, which is a number.
// But it could be a string, an object, an array, or even a function!
// Same goes for the value. It can be any data type.

launches.set(launch.flightNumber, launch);
*/

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
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
async function getAllLaunches() {
    /*
    return Array.from(launches.values());
    */
    return await launches.find({}, { '_id': 0, '__v': 0 }); // exclude the _id and __v fields
}

async function saveLaunch(launch) {
    
    try {
        // We want to make sure that the planet exists in the collection before we save the launch.
        const planet = await planets.findOne({
            keplerName: launch.target,
            });

        if (!planet) {
            throw new Error('No matching planet was found');
        }

        await launches.findOneAndUpdate({
            flightNumber: launch.flightNumber,
          }, 
          launch,
          {
          upsert: true,
          },
        )
    
      } catch(err) {
        console.error(`Could not save planet because: ${err}`);
      }
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
        });

    if (!planet) {
        throw new Error('No matching planet was found');
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
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
    //addNewLaunch,
    scheduleNewLaunch,
    
}; 