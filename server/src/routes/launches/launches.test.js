/*
Where does describte(), test(), expect(), toBe(), toStrictEqual() come from?
    - Jest knows about these functions because we installed Jest as a dependency
    - Jest is a testing framework that provides these functions
    - When we run our tests, Jest will run our code and check that the results match our expectations
*/

/*
// this is just a test to make sure Jest is working

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = 200;
        expect(response).toBe(200);
    });
});

*/

const request = require('supertest');
/*
We installed supertest as a dev dependency
    - supertest is a library that allows us to make HTTP requests in our tests
    - We can use supertest to make requests to our server and check the responses
*/
const app = require('../../app');
/*
We imported our app from server/src/app.js
*/

/*
We need to connect to the database before we run our tests
*/
const { mongoConnect,
        mongoDisconnect } = require('../../services/mongo');
// and be able to populate the test database with data
const { loadPlanetsData } = require('../../models/planets.model');

/*
Where will we connect to the database? We will use a feature of Jest
to set up an environment for our tests, inside of a describe block.

This ensures that our mongoConnect function is called before any of our tests run,
and that it stays alive for the duration of all of our tests.

This is the 'Test Launches API" describe block, combined with
beforeAll(async () => {
        await mongoConnect();
    });

*/


/*
// Verson 1
describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches');
        expect(response.statusCode).toBe(200);
    });
});
*/

describe('Test Launches API', () => {
    // set up test environment once
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    // tear down test environment once
    afterAll(async () => {
        await mongoDisconnect();
    });

    // Version 2
        describe('Test GET /launches', () => {
            test('It should respond with 200 success', async () => {
                const response = await request(app)
                    .get('/v1/launches')
                    .expect('Content-Type', /json/) // we expect the response to be JSON, the second part (/json/) is in regex format
                    .expect(200);
            });
        });

    //==================================================================================================
    // POST
    //==================================================================================================

        // Version 1
        /*
        describe('Test POST /launches', () => {
            test('It should respond with 201 created', async () => {
                const response = await request(app)
                    .post('/launches')
                    .send({
                        mission: 'USS Enterprise',
                        rocket: 'NCC 1701-D',
                        target: 'Kepler-62 f',
                        launchDate: 'January 4, 2028',
                    })
                    .expect('Content-Type', /json/) // we expect the response to be JSON, the second part (/json/) is in regex format
                    .expect(201);

                // here we will check the body of the response
                // using jest assertions
                // https://jestjs.io/docs/en/expect

                // !!!!
                // This does not work because the launchDate is a string
                // the next version will deal with this

                expect(response.body).toMatchObject({
                    mission: 'USS Enterprise',
                    rocket: 'NCC 1701-D',
                    target: 'Kepler-62 f',
                    launchDate: 980220400000, 
                });
            });
        });
        */

        // Version 2
        describe('Test POST /launches', () => {

            // !!! This is new !!!
            // We add the data we will use in multiple tests to the describe block
            // This way we don't have to repeat ourselves

            const completeLaunchData = {
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                target: 'Kepler-62 f',
                launchDate: 'January 4, 2028',
            };

            const launchDataWithoutDate = {
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                target: 'Kepler-62 f',
            };
            
            const launchDataWithInvalidDate = {
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                target: 'Kepler-62 f',
                launchDate: 'zoot',
            };

            test('It should respond with 201 created', async () => {

                const response = await request(app)
                    .post('/v1/launches')
                    .send(completeLaunchData)
                    .expect('Content-Type', /json/)
                    .expect(201);

                // here we will check the body of the response
                // using jest assertions
                // https://jestjs.io/docs/en/expect

                // !!!! This is new !!!!
                // Because dates are tricky, we will convert the dates to numbers in same format
                const requestDate = new Date(completeLaunchData.launchDate).valueOf();
                const responseDate = new Date(response.body.launchDate).valueOf();
                expect(responseDate).toBe(requestDate);

                expect(response.body).toMatchObject(launchDataWithoutDate);
            });

            test('It should catch missing required properties', async () => {
                const response = await request(app)
                    .post('/v1/launches')
                    .send(launchDataWithoutDate)
                    .expect('Content-Type', /json/)
                    .expect(400);

                // here we will check the body of the response
                // to make sure it matches our expectations
                expect(response.body).toStrictEqual({
                    error: 'Missing required launch property.',
                });
            });

            test('It should catch invalid dates', async () => {
                const response = await request(app)
                    .post('/v1/launches')
                    .send(launchDataWithInvalidDate)
                    .expect('Content-Type', /json/)
                    .expect(400);

                // here we will check the body of the response
                // to make sure it matches our expectations
                expect(response.body).toStrictEqual({
                    error: 'Invalid launch date.',
                });
            });
        });
        /*
        describe('Test POST /launches', () => {
            const completeLaunchData = {
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                target: 'Kepler-62 f',
                launchDate: 'January 4, 2028',
            };

            const launchDataWithoutDate = {
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                target: 'Kepler-62 f',
            };

            const launchDataWithInvalidDate = {
                mission: 'USS Enterprise',
                rocket: 'NCC 1701-D',
                target: 'Kepler-62 f',
                launchDate: 'zoot',
            };

            test('It should respond with 201 created', async () => {
                const response = await request(app)
                    .post('/launches')
                    .send(completeLaunchData)
                    .expect('Content-Type', /json/)
                    .expect(201);

                const requestDate = new Date(completeLaunchData.launchDate).valueOf();
                const responseDate = new Date(response.body.launchDate).valueOf();
                expect(responseDate).toBe(requestDate);

                expect(response.body).toMatchObject(launchDataWithoutDate);
            });

            test('It should catch missing required properties', async () => {
                const response = await request(app)
                    .post('/launches')
                    .send(launchDataWithoutDate)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toStrictEqual({
                    error: 'Missing required launch property',
                });
            });

            test('It should catch invalid dates', async () => {
                const response = await request(app)
                    .post('/launches')
                    .send(launchDataWithInvalidDate)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toStrictEqual({
                    error: 'Invalid launch date',
                });
            });
        });

        */
});

