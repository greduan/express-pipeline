'use strict';

var td = require('testdouble');
var assert = require('assert');

describe('express-pipeline', function () {

  var pipe = require(__dirname + '/../lib/index.js');

  it('Should return a function', function () {
    var res = pipe([]);

    assert.equal(typeof res, 'function');
  });

  it('Should call final callback', function () {
    var cb = td.function();

    var res = pipe([
      function (req, res, next) {
        next(null);
      },
      function (req, res, next) {
        next(null);
      },
    ]);

    res({}, {}, cb);

    td.verify(cb(null));
  });

  it('Should call final callback with error', function () {
    var cb = td.function();

    var res = pipe([
      function (req, res, next) {
        next(null);
      },
      function (req, res, next) {
        next(new Error('foo'));
      },
      function (req, res, next) {
        next(null);
      },
    ]);

    res({}, {}, cb);

    td.verify(cb(new Error('foo')));
  });

  it('Should pass around the same req and res objects', function () {
    var req = {}, res = {};

    var res = pipe([
      function (req, res, next) {
        req.a = 'a';
        res.a = 'a';

        next(null);
      },
      function (req, res, next) {
        req.b = 'b';
        res.b = 'b';

        next(null);
      },
    ]);

    res(req, res, td.function());

    assert.deepEqual(req, { a: 'a', b: 'b' });
    assert.deepEqual(res, { a: 'a', b: 'b' });
  });

});
