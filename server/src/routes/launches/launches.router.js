const express = require('express');

const { getAllLaunches } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllLaunches);
// launchesController.getAllLaunches

module.exports = launchesRouter;