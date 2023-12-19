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

// This abstraction is not necessary, but it is a good practice.
// This way, the rest of the application does not need to know about the map.
// We can just return the values of the map as an array.
// The Array.from() method creates a new, shallow-copied Array instance from an array-like or iterable object.
// map.values is an iterable object.
// Then we can return the List of launches as a JSON object.
function getAllLaunches() {
    return Array.from(launches.values());
}

module.exports = {
    getAllLaunches,
};