/**
 * Created by takodaregister on 5/10/17.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
/* GET users listing. */
router.get('/', function(req, res) {
    MongoClient.connect('mongodb://lsands:Sandy427!@ds137291.mlab.com:37291/s_garden', (err, db) => {

        var collection = db.collection('s_garden');
        // db.collection('s_garden').find({}, function (err, tree) {
        // if (err) {
        //     console.log(err);
        //     res.json(err);
        // }
        // else {
        //     // console.log(tree);
        //     // res.send('respond with a resource');
        //     // res.json(tree);
        // }
        collection.find({}).toArray(function(err, docs) {
            console.log(docs);
            res.json(docs);
            db.close();
        })
    // });
})});




module.exports = router;