
/**
 * Module dependencies.
 */

var express = require('express')
  , join = require('path').join
  , fs = require('fs');

var app = express();

app.use(express.favicon());
app.use(express.logger('dev'));

app.enable('strict routing');

// routes

/**
 * GET /* as a file if it exists.
 */

app.get('/:file(*)', function(req, res, next){
  var file = req.params.file;
  if (!file) return next();
  var name = req.params.example;
  var path = join(__dirname, name, file);
  fs.stat(path, function(err, stat){
    if (err) return next();
    res.sendfile(path);
  });
});

/**
 * GET /* as index.html
 */

app.get('/*', function(req, res){
  var name = req.params.example;
  res.sendfile(join(__dirname, name, 'index.html'));
});

app.listen(3000);
console.log('Example server listening on port 3000');
