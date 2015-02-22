'use strict';

var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var User = require('./user.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) { return handleError(res, err); }
    var token = jwt.sign(
      {_id: user._id },
      config.secrets.session,
      { expiresInMinutes: 60 * 5 }
    );
    res.status(201).json({ token: token, user: user });
  });
};

exports.getMe = function (req, res) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -passwordHash').lean().exec(function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.json(401); }
    User.find({}, { points: 1 }).sort('-points').exec(function (err, users) {
      if (err) { return handleError(res, err); }

      user.rank = { me: users.map(function (e) { return String(e._id); }).indexOf(String(userId)) + 1, total: users.length };

      res.status(200).json(user);
    });
  });
};

exports.listUsers = function (req, res) {
  User.find({}, '-salt -passwordHash', function (err, users) {
    if (err) { return handleError(res, err); }
    res.status(200).json(users);
  });
};
