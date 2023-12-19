const express = require('express');

const { httpGetAllLaunches,
        httpAddNewLaunch,
        httpAbortLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

// remember this is all relative to the /launches path.
// check app.js to see how we mounted this router.
launchesRouter.get('/', httpGetAllLaunches);
// launchesController.httpGetAllLaunches
launchesRouter.post('/', httpAddNewLaunch);

launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;