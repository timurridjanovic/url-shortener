
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var url = require('url');

//Mongo stuff
var MongoClient = require('mongodb').MongoClient;

//bitly-clone import
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


MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
    if (err) throw err;
    
    //get and post requests for index
    app.get('/', routes.index);

    app.post('/', function(req, res) {
        var url = req.body.shortener;
        var bitlyClone = new Bitly(url, req, res, db);
        bitlyClone.validateUrl();
    });    
        
    //get and post requests for shortenedUrls    
    app.get('/[a-zA-Z0-9]+', function(req, res) {
        var pathname = url.parse(req.url).pathname;
        db.collection('test').findOne({shortenedUrl: pathname}, function(err, doc) {
            if (err) throw err;
            if (doc) {
                res.redirect(doc.url);
            }
            else {
                console.log('lol');
                res.writeHead(200, {"Content-type": "text/plain"});
                res.end("Lol 404");
            }
        }); 
    });
            
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    }); 
}); 

   

