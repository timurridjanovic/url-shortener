
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
            this.res.render('index', {error:error});
        }
        
    },

    shorten: function(url) {
        this.urlDict = {};
        var timer = new Date().getTime();
        timer = timer%10000000;
        
        //need to add timer to ID
        var counter = 1;
        
        //adding counter to database (incrementing)
        var found = this.find('test', {counter: {$gt:0}});
        console.log('yo', found);
        if (found) {
            console.log('found: ', found);
            var newDoc = {counter: counter++};
            //this.update('test', found, newDoc);
        }
        else {
            var doc = {counter: counter};
            this.insert('test', doc);
        }
        
        var id = "" + timer + counter;
        id = parseInt(id).toString(32);
               
        var shortenedUrl = '/' + id;
        this.urlDict[shortenedUrl] = url;
        
        //adding shortenedUrl and url to database
        var doc = {shortenedUrl: shortenedUrl, url: url};
        this.insert('test', doc);
        
        return shortenedUrl;
        
    },

    redirect: function(url) {
        this.res.redirect(url);
    },
    
    insert: function (collection, doc) {
        //Find one document in our collection
        this.db.collection(collection).insert(doc, function(err, inserted) {
            if (err) throw err;
        
            console.dir("Successfully inserted: " + JSON.stringify(inserted));
        
            return inserted;
        });
    },
    
    find: function(collection, query) {
        this.db.collection(collection).findOne(query, function(err, doc) {
            if (err) throw err;
            console.log(doc.counter);
            
            return doc
        });
        console.log('yeah', doc);
    },
    
    update: function(collection, doc, newDoc) {
        this.db.collection(collection).update(doc, {$set: newDoc}, function(err, data) {
            if (err) throw err;
            
            console.log("update succeeded: ", data);
        });
    },
};

module.exports = Bitly;

