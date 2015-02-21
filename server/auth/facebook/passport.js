'use strict';

var config = require('../../config/environment');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (User) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.appId,
      clientSecret: config.facebook.secret,
      callbackURL: "http://localhost:9000/auth/facebook/callback",
      enableProof: false
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          user = new User({
            email: profile._json.email,
            facebook: profile._json
          });
          user.save(function (err) {
            if (err) { return done(err); }
            done(null, user);
          });
        } else {
          done(null, user);
        }
      });
    }
  ));
};
