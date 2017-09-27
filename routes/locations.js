/**
 * Created by takodaregister on 7/20/17.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
router.get('/', function(req, res) {
    MongoClient.connect('mongodb://lsands:Sandy427!@ds137291.mlab.com:37291/s_garden', (err, db) => {

        var collection = db.collection('locations');
        collection.find({}).toArray(function(err, tree) {
            res.json(tree);
            db.close();
        })
    })});

module.exports = router;