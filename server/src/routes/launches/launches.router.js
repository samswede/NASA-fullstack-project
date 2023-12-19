const express = require('express');

const { httpGetAllLaunches } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', httpGetAllLaunches);
// launchesController.httpGetAllLaunches

module.exports = launchesRouter;