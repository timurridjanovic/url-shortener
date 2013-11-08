
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
<<<<<<< HEAD
//var CONNECTION = 'mongodb://Timur:t0241422@ds053688.mongolab.com:53688/heroku_app19229370'
var CONNECTION = 'mongodb://localhost:27017/test'
=======
>>>>>>> 1c4ab3dd403092724473ee4d9de76a40d5b12d27

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


<<<<<<< HEAD
MongoClient.connect(CONNECTION, function (err, db) {
=======
MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
>>>>>>> 1c4ab3dd403092724473ee4d9de76a40d5b12d27
    if (err) throw err;
    
    //get and post requests for index
    app.get('/', routes.index);
<<<<<<< HEAD
    
    app.post('/ajax', function(req, res) {
        var url = req.body.name;
        var bitlyClone = new Bitly(url, req, res, db);
        bitlyClone.validateUrl();
    });    

        
    //get requests for shortenedUrls    
    app.get('/[a-zA-Z0-9]+', function(req, res) {
        var pathname = url.parse(req.url).pathname;
        
        var shortenerPage = new Bitly(pathname, req, res, db);
        shortenerPage.find('test', {shortenedUrl: pathname}, function(found) {
            if (found) {
                //update total clicks for stats
                db.collection('test').update({shortenedUrl: pathname}, {$inc: {totalClicks: 1}}, 
                    {upsert: true}, function(err, data) {
                    
                        if (err) throw err;
                        console.log('updated clicks:', data);
                });        
                /////////////////    
                 
                //update clicks per date for stats
                var today = shortenerPage.createDate('today');
                shortenerPage.find('test', {'shortenedUrl': pathname, 'clicksPerDate.date': today}, function(found) {
                    if (found) {
                        db.collection('test').update({'shortenedUrl': pathname, 'clicksPerDate.date': today}, 
                            {$inc:{'clicksPerDate.$.clicks': 1}}, function(err, data) {
                                if (err) throw err;
                                console.log('updated clicks date found: ', data);
                        });
                    }
                    else {
                        db.collection('test').update({'shortenedUrl': pathname}, 
                            {$push: {'clicksPerDate': {date: today, clicks: 1}}}, function(err, data) {
                                if (err) throw err;
                                console.log('updated clicks date not found: ', data);  
                        });
                    }
                });
                                    
                res.redirect(found.url);
            }    
            else {
                res.writeHead(200, {"Content-type": "text/plain"});
                res.end("Lol 404");                
            }
        }); 
    });
    
    //get requests for stats
    app.get('/[a-zA-Z0-9]+[+]', function(req, res) {
        var pathname = url.parse(req.url).pathname;
        pathname = pathname.slice(0, -1);
        
        var statsPage = new Bitly(pathname, req, res, db);
        statsPage.find('test', {shortenedUrl: pathname}, function(found) {
            if (found) {
                var clicks = 0;
                if (found.totalClicks) {
                    clicks = found.totalClicks;
                }
                var dateRange = found.clicksPerDate;
                console.log(dateRange);
                //res.send(dateRange);
                res.render('stats', {clicks: clicks, dateRange: JSON.stringify(dateRange)}); 
            }
            else {
                res.writeHead(200, {"Content-type": "text/plain"});
                res.end("Lol 404");   
            }
        });
    });
    

=======

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
>>>>>>> 1c4ab3dd403092724473ee4d9de76a40d5b12d27
            
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    }); 
}); 

   


