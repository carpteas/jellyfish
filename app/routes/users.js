'use strict';

var User 			= require('app/models/user.js');

module.exports = function(req, res, next) {
  User.find({}, function(err, users) {
    return next(res.send(users));
  });
};