"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const OAuth2Strategy = require("passport-oauth2").Strategy;
const User = require("../models/user");
const UserList = new Map();
const request = require('request');

const localInit = function (req, email, password, callback, res) {
    ad.authenticate(email, password, function(err, auth) {
        if (err) {
            console.log('ERROR: '+JSON.stringify(err));
            return callback(err);
        }

        if (auth) {
            console.log('Authenticated!');
            console.log(auth);
            var user = new User("local");
            user.email = email;
            return callback(null, user);
        }
        else {
            console.log('Authentication failed!');
            return(callback("FAIL"));
        }
    });
};

passport.use("local-register", new LocalStrategy({
    usernameField: "email",
    passReqToCallback: true
}, localInit));

const facebookConfig = {
    clientID: "1854048231505343",
    clientSecret: "74bc3873991e888cba66d16cb0519340",
    callbackURL: "http://localhost:3111/facebook/callback",
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'emails', 'photos']

};

const twitterConfig = {
    consumerKey: "XPnvLxuEl4DTXCd8TeZNye14B",
    consumerSecret: "b97PhwPF94bz1lSmHmVykkindc9NJXSY72BOUbmh3cYAJyBxIa",
    callbackURL: "http://localhost:3111/twitter/callback",
    includeEmail: true,
    passReqToCallback: true
};

const googleConfig = {
    clientID: '205697855294-j1ibep3glo58ng8k6hmltcrlpbla1n14.apps.googleusercontent.com',
    clientSecret: 'mf2q9MnCVIB3vKELNcKhXlRb',
    callbackURL: 'http://localhost:3111/google/callback'
};

const linkedinConfig = {
    clientID: '77nuozx1l9zbt7',
    clientSecret: 'gMDdasNVtJ3c0qAl',
    callbackURL: 'http://localhost:3111/linkedin/callback',
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline'],
    state: true,
    passReqToCallback: true
};

const facebookInit = function (req, token, refreshToken, profile, callback) {
    var user = new User("facebook");
    user.id = profile.id;
    user.token = token;
    user.email = profile.emails[0].value;
    return callback(null, user);
};

const twitterInit = function (req, token, refreshToken, profile, callback) {
    var user = new User("twitter");
    console.log("TAKODA's EMAIL: " + profile.emails[0].value)
    user.id = profile.id;
    user.token = token;
    user.username = profile.username;
    user.displayName = profile.displayName;
    // newUser.twitter.lastStatus = profile._json.status.text; // todo - status.text doesn't exist
    user.email = profile.emails[0].value;
    return callback(null, user);
};
const googleInit = function (req, token, refreshToken, profile, callback) {
    var user = new User("google");
    user.id = profile.id;
    user.token = token;
    user.email = profile.emails[0].value;
    return callback(null, user);
};
const linkedinInit = function (req, accessToken, refreshToken, profile, done, callback) {
    var user = new User("linkedin");
    user.id = done.id;
    user.token = accessToken;
    user.email = done.emails[0].value;
    return callback(null, user);
};

passport.use(new FacebookStrategy(facebookConfig, facebookInit));
passport.use(new TwitterStrategy(twitterConfig, twitterInit));
passport.use(new GoogleStrategy(googleConfig, googleInit));
passport.use(new LinkedInStrategy(linkedinConfig, linkedinInit));

passport.serializeUser(function (user, callback) {
    UserList.set(user.email, user);
    callback(null, user.email);
});
passport.deserializeUser(function (email, callback) {
    let user = UserList.get(email);
    callback(null, user);
});

module.exports = {
    facebook: {
        login: passport.authenticate("facebook", {scope: "email"}),
        callback: passport.authenticate("facebook", {
            successRedirect: "/profile",
            failureRedirect: "/"
        }),
        connect: passport.authorize("facebook", {scope: ["email"]}),
        connectCallback: passport.authorize("facebook", {
            successRedirect: "https://www.facebook.com/",
            failureRedirect: "/profile"
        }),
        disconnect: function (req, res, next) {
            var user = req.user;
            user.facebook.id = undefined;
            user.facebook.email = undefined;
            user.facebook.token = undefined;
            user.save(function (err) {
                next();
            });
        }
    },
    twitter: {
        login: passport.authenticate("twitter", {scope: ['r_basicprofile', 'r_emailaddress']}),
        callback: passport.authenticate("twitter", {
            successRedirect: "/profile",
            failureRedirect: "/"
        }),
        disconnect: function (req, res, next) {
            var user = req.user;
            user.id = undefined;
            user.token = undefined;
            user.username = undefined;
            user.displayName = undefined;

            next();

        }
    },
    google: {
        login: passport.authenticate('google', {scope: ['profile', 'email']}),
        callback: passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        })
    },
    localLogin:
        passport.authenticate("local-register", {
            successRedirect: '/profile',
            failureRedirect: '/f'
        })
    ,
    linkedin: {
        login: passport.authenticate('linkedin', {scope: ['r_basicprofile', 'r_emailaddress']}),
        callback: passport.authenticate('linkedin', {
            successRedirect: '/profile',
            failureRedirect: '/'
        })
    }
};


