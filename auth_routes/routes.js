var router = require("express").Router();
var authConfig = require("./auth-config");
router.get("/", function (req, res) {
    console.log(req.query);
    console.log(req.query.state);
    res.render("index.ejs", { state: req.query.state });
});


router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/facebook", authConfig.facebook.login);
router.get("/facebook/callback", authConfig.facebook.callback);

router.get("/twitter", authConfig.twitter.login);
router.get("/twitter/callback", authConfig.twitter.callback);

router.get("/google", authConfig.google.login);
router.get("/google/callback", authConfig.google.callback);

router.get("/linkedin", authConfig.linkedin.login);
router.get("/linkedin/callback", authConfig.linkedin.callback);

router.get("/eula", function (req, res) {
    res.render("eula.ejs");
});

router.get("/disconnect/facebook", authConfig.facebook.disconnect, function(req, res) {
    res.redirect("/profile");
});

router.get("/profile", ensureAuthenticated, function(req, res) {
    res.render("profile.ejs", { user: req.user });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;