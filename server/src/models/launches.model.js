// Why are we using a map instead of an array?
// https://stackoverflow.com/questions/500504/why-use-a-map-over-an-object-in-javascript
// 

const launches = new Map();

const launch = {
    flightNumber: 100,
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


module.exports = {
    launches,
};