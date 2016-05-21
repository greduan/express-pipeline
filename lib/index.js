'use strict';

var async = require('async');

/**
 * Takes in an array of Express-like middlewares and returns an
 * Express-like middleware which executes the middlewares it was given in
 * the order it was given them.
 *
 * @method pipe
 * @param {Array} middlewares Express-like middlewares
 * @return {Function} Express-like middleware
 */
module.exports = function (middlewares) {
  return function pipeline (req, res, bigNext) {
    async.eachSeries(
      middlewares,
      function (mid, next) {
        mid(req, res, next);
      },
      bigNext
    );
  };
};
