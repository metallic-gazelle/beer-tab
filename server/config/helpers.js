var jwt = require('jwt-simple');

module.exports = {
  errorLogger: function (error, req, res, next) {
    // log the error then send it to the next middleware in middleware.js
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    res.status(500).send({error: error.message});
  },

  decode: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      return res.status(403); // send forbidden if a token is not provided
    }
    // Try FBook token first, fall back to jwt otherwise
    try {
      var fbToken = JSON.parse(token);
      user = fbToken.username;
      req.user = user;
      next();
    } catch (error) {
      // try jwt if FB token not found
      console.log("Decode Error First");
      try {
        // decode token and attach user to the request for use inside of the request handlers
        user = jwt.decode(token, 'argleDavidBargleRosson');
        req.user = user;
        next();
      } catch (error) {
        return next(error);
      }
    }
  }
};