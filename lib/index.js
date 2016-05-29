'use strict';

var async = require('async');

var errorPipe = require('./error.js');

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
