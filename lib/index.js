'use strict';

var async = require('async');

/**
 * Takes in an array of Express-like middlewares that take 4 arguments, i.e. are
 * error handlers, and returns an Express-like error handling middleware which
 * executes the middlewares it was given in the order it was given them.
 *
 * @method errorPipe
 * @param {Array} middlewares Express-like error handling middlewares
 * @return {Function} errorPipeline Express-like error handling middleware
 */
var errorPipe = function (middlewares) {
  return function errorPipeline (err, req, res, bigNext) {
    async.eachSeries(
      middlewares,
      function (mid, next) {
        mid(err, req, res, next);
      },
      bigNext
    );
  };
};

/**
 * Takes in an array of Express-like middlewares and returns an
 * Express-like middleware which executes the middlewares it was given in
 * the order it was given them.
 *
 * @method pipe
 * @param {Array} middlewares Express-like middlewares
 * @return {Function} pipeline Express-like middleware
 */
var pipe = function (middlewares) {
  var pipeline = function pipeline (req, res, bigNext) {
    async.eachSeries(
      middlewares,
      function (mid, next) {
        mid(req, res, next);
      },
      bigNext
    );
  };

  return pipeline;
};

Object.defineProperty(pipe, 'error', {
  get: function () { return errorPipe },
});

module.exports = pipe;
