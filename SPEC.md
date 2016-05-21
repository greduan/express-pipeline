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
  middlewares, so that the same middleware can be used with or without
  express-pipeline.

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
var browser = pipe([
  acceptHtml,
  jwt,
]);

var api = pipe([
  acceptJson,
  jwt,
]);

var resourcePipe = pipe([
  browser,
  api,
]);

app.all('/Users/*', resourcePipe);
```
