var express = require('express');
var router = express.Router();
var request = require('request');

/* GET HNHH listing. */
router.get('/', function (req, res, next) {
    var test = "<h1>fail</h1>";
    request('http://www.hotnewhiphop.com', function (error, response, html) {
        if (!error) {
            console.log(html);

            res.json(html);
        }
        else {
            throw(error);
        }
    });

});

module.exports = router;