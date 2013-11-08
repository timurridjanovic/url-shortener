//mongo ds053688.mongolab.com:53688/heroku_app19229370 -u Timur -p
//var DOMAIN = 'http://bitly-cloned.herokuapp.com'
var DOMAIN = 'http://localhost:3000'

var Bitly = function(url, req, res, db) {
    this.url = url;
    this.req = req;
    this.res = res;
    this.db = db;
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
            this.res.send(error)
        }
        
    },

    shorten: function(url) {
        var timer = new Date().getTime();
        timer = timer%10000000;
        
        var counter = 1;
        //adding counter to database (incrementing)
        this.find('test', {counter: {$gt:0}}, function(found) {
            if (found) {
                counter = found.counter+1;
                var newDoc = {counter: counter};
                this.update('test', found, newDoc);
            }
            else {
                var newDoc = {counter: counter};
                this.insert('test', newDoc);
            }
            var id = "" + timer + counter;
            id = parseInt(id).toString(32);
            var shortenedUrl = '/' + id;
           
            var urlDoc = {shortenedUrl: shortenedUrl, url: this.url, totalClicks: 0, clicksPerDate: []};
            this.insert('test', urlDoc);
            
            this.res.send(DOMAIN + shortenedUrl);
            
        }.bind(this));
    },

    redirect: function(url) {
        this.res.redirect(url);
    },
    
    insert: function (collection, doc) {
        //Find one document in our collection
        this.db.collection(collection).insert(doc, function(err, inserted) {
            if (err) throw err;
        
            console.dir("Successfully inserted: " + JSON.stringify(inserted));
        });
    },
    
    find: function(collection, query, callback) {
        var theDoc = null;
        this.db.collection(collection).findOne(query, function(err, doc) {
            if (err) throw err;
            callback(doc)
        });
    },
    
    update: function(collection, doc, newDoc) {
        this.db.collection(collection).update(doc, {$set: newDoc}, function(err, data) {
            if (err) throw err;
            
            console.log("update succeeded: ", data);
        });
    },
    
    createDate: function(date) {
        var createdDate = null;
        if (date === 'today') {
            createdDate = new Date();
            createdDate.setHours(0, 0, 0, 0);
        }
        else if (date === 'yesterday') {
            createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - 1);
            createdDate.setHours(0, 0, 0, 0);
        }
        else if (date === 'tomorrow') {
            createdDate = new Date();
            createdDate.setDate(createdDate.getDate() + 1);
            createdDate.setHours(0, 0, 0, 0);
        }
        console.log(createdDate);
        return createdDate;
    }
};

module.exports = Bitly;

