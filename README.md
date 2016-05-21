# express-pipeline

express-pipeline allows you to put under one name a set of
middlewares, when you use the generated middleware all the middlewares
are run in the order you define.

These middleware groups are nestable, so you can have one or more
groups under another group, and so on.

One limitation is that at the moment they do not support accepting an
`err`, in other words this package does not at this moment work for
pipelining error handling.

## Usage

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

## Installation

```
$ npm i -SE express-pipeline
```

## Tests

```
$ git clone https://github.com/greduan/express-pipeline.git
$ cd express-pipeline
$ npm i
$ npm test
```

## License

Check the `LICENSE` file for licensing details.
