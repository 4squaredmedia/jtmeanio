'use strict';

// Configuring the Articles module
angular.module('wishlists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Wishlists', 'wishlists', 'dropdown', '/wishlists(/create)?');
		Menus.addSubMenuItem('topbar', 'wishlists', 'List Wishlists', 'wishlists');
		Menus.addSubMenuItem('topbar', 'wishlists', 'New Wishlist', 'wishlists/create');
	}
]);