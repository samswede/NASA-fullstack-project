const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const planets = require('./planets.mongo');  


//const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

/*
Below is the code we used to read the CSV file and parse it into a JavaScript object.
We used the csv-parse package to parse the CSV file.
We used the fs package to read the CSV file.

We used the pipe method to pipe the data from the read stream to the parse stream.

However, we are using promises and async/await to stream the data from the CSV file.

This can result in the data being exported before the data is finished being streamed.

We will turn this whole process into a promise so that we can use async/await to stream the data.

Once again, below is how the code looked before we turned it into a promise.

// ==============================

fs.createReadStream('kepler_data.csv')
  .pipe(parse({
    comment: '#',
    columns: true,
  }))
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log(habitablePlanets.map((planet) => {
      return planet['kepler_name'];
    }));
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });

  module.exports = {
    planets: habitablePlanets, // rename to planets
    };

// ==============================

*/

// note that when we import this, we will also need to use async/await:
// const { loadPlanetsData } = require('./models/planets.model');
// await loadPlanetsData();

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {

            //habitablePlanets.push(data);

            //
            // insert + update = upsert
            // mongoose lets us upsert
              savePlanet(data);

            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} habitable planets found!`);
            resolve();
        });
    });
    }

async function getAllPlanets() {
    return await planets.find({}, {
      '_id': 0, 
      '__v': 0,
    
    }); // exclude the _id and __v fields
    };
  
async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name
      }, 
      {
      keplerName: planet.kepler_name 
      },
      {
      upsert: true,
      },
    )

  } catch(err) {
    console.error(`Could not save planet because: ${err}`);
  }
};
  

module.exports = {
    loadPlanetsData,
    getAllPlanets,
    };