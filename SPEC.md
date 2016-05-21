# express-pipeline spec

## Intro

express-pipeline is a lib that provides you the ability to run a set of
Express-style middlewares on specific URLs or under specific conditions.

For example, run the session middlewares only if in the API and not in
the website users interact with.  Or run the JSON parsing middleware
only in certain bits, etc.

In essence it's a middleware grouper.

## Constraints

- Middleware internals must be defined in the same fashion as Express
  middlewares.

## Assumptions

- Will be used within an Express app.

## Functional spec

### `express-pipeline`

```
/**
 * Takes in an array of Express-like middlewares and returns an
 * Express-like middleware which executes the middlewares it was given in
 * the order it was given them.
 *
 * @method pipe
 * @param {Array} middlewares Express-like middlewares
 * @return {Function} Express-like middleware
 */
```

### Middleware definition

Middlewares that are passed into the pipeline should be able to be
exactly like the normal Express middlewares.

```
module.exports = function (req, res, next) {
  req.role = 'Visitor';
  next();
};
```

## Code snippets

```
var pipe = require('express-pipeline');

// some middlewares
var loadUser = function (req, res, next) { next() };
var loadFiles = function (req, res, next) { next() };
var loadInfo = function (req, res, next) { next() };
var session = function (req, res, next) { next() };
var token = function (req, res, next) { next() };

// couple of pipelines
var loadStuffPipe = pipe([
  loadUser,
  loadFiles,
  loadInfo,
]);

var securityPipe = pipe([
  session,
  token,
]);

var userPipeline = pipe([
  loadStuffPipe,
  securityPipe,
]);

// Express app
app.all('/Users/*', userPipeline);
```
