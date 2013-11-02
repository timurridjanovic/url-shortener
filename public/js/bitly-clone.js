


var Bitly = function(url, req, res) {
    this.url = url;
    this.req = req;
    this.res = res;
    this.connection();
}

Bitly.prototype = {

    validateUrl: function() {
        var regex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        
        if (regex.test(this.url)) {
            var url = this.shorten(this.url);
            //this.redirect(url);
            
        }
        else {
            var error = "Please enter a valid URL";
            this.res.render('index', {error:error});
        }
        
    },

    shorten: function(url) {
        this.urlDict = {};
        var timer = new Date().getTime();
        
        //need to add timer to ID
        
        var id = timer.toString(32);
        
        var shortenedUrl = '/' + id;
        this.urlDict[shortenedUrl] = url;
        
        return shortenedUrl;
        
    },

    redirect: function(url) {
        this.res.redirect(url);
    },
    
    connection: function () {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:3000/test', function(err, db) {
            if (err) throw err;
    
            //Find one document in our collection
            db.collection('coll').findOne({}, function(err, doc) {
                if (err) throw err;
            
                console.dir(doc);
                
                db.close();
            });
        
            console.dir("Called findOne!");
        });

    }
};

module.exports = Bitly;

