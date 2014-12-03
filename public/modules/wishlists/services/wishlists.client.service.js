'use strict';

//Wishlists service used to communicate Wishlists REST endpoints
angular.module('wishlists').factory('Wishlists', ['$resource',
	function($resource) {
		return $resource('wishlists/:wishlistId', { wishlistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);