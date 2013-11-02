
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var url = require('url');
var Bitly = require('./public/js/bitly-clone');

var app = express();
//added
var cons = require('consolidate');
//

//added
app.engine('html', cons.swig);
//

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//get requests
app.get('/', routes.index);

//post requests
app.post('/', function(req, res) {
    var url = req.body.shortener;
    var bitlyClone = new Bitly(url, req, res);
    bitlyClone.validateUrl();
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
