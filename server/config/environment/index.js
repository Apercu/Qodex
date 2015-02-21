'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    appId: '355095451349552',
    secret: '55b0452b400d71cef6a419a91613d7ea',
    callback: 'http://192.99.2.67:4460//auth/facebook/callback'
  },

  secrets: {
    session: 'zavatta' || process.env.SESSION_SECRET
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
