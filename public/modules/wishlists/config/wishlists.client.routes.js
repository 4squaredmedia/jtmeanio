'use strict';

//Setting up route
angular.module('wishlists').config(['$stateProvider',
	function($stateProvider) {
		// Wishlists state routing
		$stateProvider.
		state('listWishlists', {
			url: '/wishlists',
			templateUrl: 'modules/wishlists/views/list-wishlists.client.view.html'
		}).
		state('createWishlist', {
			url: '/wishlists/create',
			templateUrl: 'modules/wishlists/views/create-wishlist.client.view.html'
		}).
		state('viewWishlist', {
			url: '/wishlists/:wishlistId',
			templateUrl: 'modules/wishlists/views/view-wishlist.client.view.html'
		}).
		state('editWishlist', {
			url: '/wishlists/:wishlistId/edit',
			templateUrl: 'modules/wishlists/views/edit-wishlist.client.view.html'
		});
	}
]);