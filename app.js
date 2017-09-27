var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var index = require('./routes/index');
var users = require('./routes/users');
var s_garden = require('./routes/s_garden_get');
var locations = require('./routes/locations');
// var hnhh = require('./routes/hotnewhiphop');

//TODO setup config file for host
var config = require('config');
var hostName = config.get('host.name');
console.log(hostName);

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.use('/s_garden_trees', s_garden);
app.use('/locations', locations);
// app.use('/hotnewhiphop', hnhh);
app.use('/s_garden_trees/:slug', function(req, res) {
    MongoClient.connect('mongodb://lsands:Sandy427!@ds137291.mlab.com:37291/s_garden', (err, db) => {
        treeId = req.params.slug;
        var collection = db.collection('s_garden');
        collection.find({'id': treeId}).toArray(function (err, tree) {
            res.json(tree);
            db.close();
        })
    })
});

app.post('/s_garden', function (req, res) {
    tree = req.body;
    MongoClient.connect('mongodb://lsands:Sandy427!@ds137291.mlab.com:37291/s_garden', (err, db) => {
        var collection = db.collection('s_garden');
        collection.insertOne(tree, function(err, res) {
            if (err) throw err;
            console.log("1 record inserted");

        });
        res.writeHead(301,
            {Location: hostName}
        );
        res.end();
    })
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
