'use strict';

module.exports = function(req, res, next) {
  return next(res.send({
  	success: true,
  	message: 'jellyfish: contact lichen.peng@gmail.com to learn howto'
  }));
};