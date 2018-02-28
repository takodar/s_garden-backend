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
    clientID: "1826819544266505",
    clientSecret: "e7d805bc58e798bc04fdd04a8d80de62",
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
    clientID: '275500112782-ad2p28nanrpc62eacdr8mfqgh0pr7bk1.apps.googleusercontent.com',
    clientSecret: 'GDFkyvDNJH-SdnoH1GHK_EvY',
    callbackURL: 'http://localhost:3111/google/callback'
};

const linkedinConfig = {
    clientID: '86xx0814qduicq',
    clientSecret: 'Zxc5Bunkj3qJ9dwq',
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


