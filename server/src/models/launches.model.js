// Why are we using a map instead of an array?
// https://stackoverflow.com/questions/500504/why-use-a-map-over-an-object-in-javascript
// 
const axios = require('axios');

const launches = require('./launches.mongo');

// this is just used for validation
const planets = require('./planets.mongo');


//let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: DEFAULT_FLIGHT_NUMBER,        // flight_number
    mission: 'Kepler Exploration X',            // name
    rocket: 'Explorer IS1',                     // rocket.name
    launchDate: new Date('December 27, 2030'),  // date_local
    target: 'Kepler-442 b',                     // not applicable
    customers: ['ZTM', 'NASA'],                 // payloads.customers for each payload
    upcoming: true,                             // upcoming
    success: true,                              // success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"



async function populateLaunches() {

    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
                pagination: false,
                populate: [
                        {
                            path: 'rocket',
                            select: {
                                name: 1
                            }
                        },
                        {
                            path: 'payloads',
                            select: {
                                customers: 1
                            }
                        }
                ]
        }
    })

    if (!response.ok) { // if not work, then use: (!response.status === 200)
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload) => {
            return payload.customers;
        });

        const flightData = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
            customers: customers,

            //target: 'Kepler-442 b', // not applicable, but needed to pass validation
        };

        console.log(`${flightData.flightNumber} ${flightData.mission}`);

        //TO DO: populate launches collection
        //await saveLaunch(flightData);
    }
};

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if (firstLaunch) {
        console.log('Launch data already loaded!');
    } else {
        await populateLaunches();
    }
}

/*
async function populateLaunches() {
    console.log('Downloading launch data...');
    const response = await fetch('https://api.spacexdata.com/v3/launches', {
        method: 'GET',
    });

    if (!response.ok) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchData = await response.json();
    //console.log(launchData);

    for (const launch of launchData) {
        const payloads = launch.rocket.second_stage.payloads;
        const customers = payloads.flatMap((payload) => {
            return payload.customers;
        });

        const flightData = {
            flightNumber: launch.flight_number,
            mission: launch.mission_name,
            rocket: launch.rocket.rocket_name,
            launchDate: launch.launch_date_unix,
            upcoming: launch.upcoming,
            success: launch.launch_success,
            customers,
        };

        console.log(`${flightData.flightNumber} ${flightData.mission}`);

        await saveLaunch(flightData);
    }
};
*/
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

async function findLaunch(filter) {
    return await launches.findOne(filter);
};

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
};

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
    /*
    We could have done
    launches.delete(launchId);
    but we are in the era of big data and machine learning.
    We want to keep the data for future analysis.
    So we will just update the launch object.
    */
    //const aborted = launches.get(launchId);
    const aborted = await launches.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });
    // note that we are not using upsert = true here.
    // because we don't want to create a new launch if it doesn't exist.
    // we only want to update an existing launch.
    // and we know that the launch exists because we checked it in the existsLaunchWithId function.

    successfullyAborted = (aborted.modifiedCount === 1); // modifiedCount is a property of the result object
    return successfullyAborted;
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

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
        }, 
        launch,
        {
        upsert: true,
        },
    );
}

async function scheduleNewLaunch(launch) {
    try {
        // We want to make sure that the planet exists in the collection before we save the launch.
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

        } catch (error) {
            console.error(`Could not schedule launch because: ${error}`);
        }
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
    loadLaunchData,
    existsLaunchWithId,
    abortLaunchById,
    getAllLaunches,
    //addNewLaunch,
    scheduleNewLaunch,
    
}; 