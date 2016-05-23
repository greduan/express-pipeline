'use strict';

var td = require('testdouble');
var assert = require('assert');

describe('express-pipeline', function () {

  var pipe = require(__dirname + '/..');

  it('Should return a function', function () {
    var res = pipe([]);

    assert.equal(typeof res, 'function');
  });

  it('Should call final callback', function () {
    var cb = td.function();

    var res = pipe([
      function (req, res, next) { next() },
      function (req, res, next) { next() },
    ]);

    res({}, {}, cb);

    td.verify(cb(null));
  });

  it('Should call middlewares in same order they were provided', function () {
    var cb = td.function();
    var call = td.function();

    var res = pipe([
      function (req, res, next) {
        call('first');
        next();
      },
      function (req, res, next) {
        call('second');
        next();
      },
      function (req, res, next) {
        call('third');
        next();
      },
      function (req, res, next) {
        call('fourth');
        next();
      },
    ]);

    res({}, {}, cb);

    td.verify(call('first'));
    td.verify(call('second'));
    td.verify(call('third'));
    td.verify(call('fourth'));
    td.verify(cb(null));
  });

  it('Should pass error to final callback and skip rest of middlewares', function () {
    var noCall = td.function();
    var cb = td.function();

    var res = pipe([
      function (req, res, next) { next(new Error('foo')) },
      function (req, res, next) {
        noCall('oops');
        next(null);
      },
    ]);

    res({}, {}, cb);

    td.verify(noCall(), { times: 0 });
    td.verify(cb(new Error('foo')));
  });

  it('Should pass around the same req and res objects', function () {
    var cb = td.function();

    var req = {},
      res = {};

    var res = pipe([
      function (req, res, next) {
        req.a = 1;
        res.a = 1;

        next(null);
      },
      function (req, res, next) {
        req.b = 2;
        res.b = 2;

        next(null);
      },
    ]);

    res(req, res, cb);

    assert.deepEqual(req, { a: 1, b: 2 });
    assert.deepEqual(res, { a: 1, b: 2 });
    td.verify(cb(null));
  });

  it('Should work with nested pipelines', function () {
    var cb = td.function();

    var res = pipe([
      pipe([
        function (req, res, next) { next() },
      ]),
      pipe([
        function (req, res, next) { next() },
      ]),
    ]);

    res({}, {}, cb);

    td.verify(cb(null));
  });

  it('Should pass error with nested pipelines and skip the rest of the pipelines', function () {
    var cb = td.function();
    var noCall = td.function();

    var res = pipe([
      pipe([
        function (req, res, next) { next(new Error('foo')) },
      ]),
      pipe([
        function (req, res, next) {
          noCall('oops');
          next();
        },
      ]),
    ]);

    res({}, {}, cb);

    td.verify(noCall(), { times: 0 });
    td.verify(cb(new Error('foo')));
  });

});
