'use strict';

var _ = require('lodash');
var slug = require('slug');
var Quizz = require('./quizz.model');

function handleError(res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Quizz
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Quizz.find({}, { 'questions': 0 }).exec(function (err, quizzs) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(quizzs);
  });
};

/**
 * Get a single Quizz
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  Quizz.findById(req.params.id, function (err, quizz) {
    if (err) { return handleError(res, err); }
    if (!quizz) { return res.status(404).end(); }
    return res.status(200).json(quizz);
  });
};

/**
 * Creates a new Quizz in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  req.body.slug = slug(req.body.name);
  Quizz.create(req.body, function (err, quizz) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(quizz);
  });
};

/**
 * Updates an existing Quizz in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Quizz.findById(req.params.id, function (err, quizz) {
    if (err) { return handleError(res, err); }
    if (!quizz) { return res.status(404).end(); }
    var updated = _.merge(quizz, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(quizz);
    });
  });
};

/**
 * Deletes a Quizz from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  Quizz.findById(req.params.id, function (err, quizz) {
    if (err) { return handleError(res, err); }
    if (!quizz) { return res.status(404).end(); }
    quizz.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).end();
    });
  });
};
