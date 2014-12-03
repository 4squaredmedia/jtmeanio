'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var wishlists = require('../../app/controllers/wishlists.server.controller');

	// Wishlists Routes
	app.route('/wishlists')
		.get(wishlists.list)
		.post(users.requiresLogin, wishlists.create);

	app.route('/wishlists/:wishlistId')
		.get(wishlists.read)
		.put(users.requiresLogin, wishlists.hasAuthorization, wishlists.update)
		.delete(users.requiresLogin, wishlists.hasAuthorization, wishlists.delete);

	// Finish by binding the Wishlist middleware
	app.param('wishlistId', wishlists.wishlistByID);
};
