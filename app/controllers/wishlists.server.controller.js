'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wishlist = mongoose.model('Wishlist'),
	_ = require('lodash');

/**
 * Create a Wishlist
 */
exports.create = function(req, res) {
	var wishlist = new Wishlist(req.body);
	wishlist.user = req.user;

	wishlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wishlist);
		}
	});
};

/**
 * Show the current Wishlist
 */
exports.read = function(req, res) {
	res.jsonp(req.wishlist);
};

/**
 * Update a Wishlist
 */
exports.update = function(req, res) {
	var wishlist = req.wishlist ;

	wishlist = _.extend(wishlist , req.body);

	wishlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wishlist);
		}
	});
};

/**
 * Delete an Wishlist
 */
exports.delete = function(req, res) {
	var wishlist = req.wishlist ;

	wishlist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wishlist);
		}
	});
};

/**
 * List of Wishlists
 */
exports.list = function(req, res) { 
	Wishlist.find().sort('-created').populate('user', 'displayName').exec(function(err, wishlists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wishlists);
		}
	});
};

/**
 * Wishlist middleware
 */
exports.wishlistByID = function(req, res, next, id) { 
	Wishlist.findById(id).populate('user', 'displayName').exec(function(err, wishlist) {
		if (err) return next(err);
		if (! wishlist) return next(new Error('Failed to load Wishlist ' + id));
		req.wishlist = wishlist ;
		next();
	});
};

/**
 * Wishlist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wishlist.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
