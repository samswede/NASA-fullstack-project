const planets = require('../../models/planets/planets.model');

function getAllPlanets(req, res) {
    /*
    Note that we are using return here, but its not necessary.
    We are using it here to stop the function from executing
    after we send the response.

    We only want to send one response, so we return after
    we send the response.

    If we didn't return, the function would continue executing
    and we would get an error like this:
    Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

    This is a common mistake, so be on the lookout for it.

    Its good practice to return after sending a response.

    Prevents difficult to debug errors.
    */
    return res.status(200).json(planets);
}

module.exports = {
    getAllPlanets,
};