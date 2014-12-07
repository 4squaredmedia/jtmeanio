'use strict';

// Wishlists controller
angular.module('wishlists').controller('WishlistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Wishlists',
	function($scope, $stateParams, $location, Authentication, Wishlists) {
		$scope.authentication = Authentication;

		// Create new Wishlist
		$scope.create = function() {
			// Create new Wishlist object
			var wishlist = new Wishlists ({
				name: this.name,
				cigars: [brand:this.brand, vitola: this.vitola]
			});

			// Redirect after save
			wishlist.$save(function(response) {
				$location.path('wishlists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wishlist
		$scope.remove = function(wishlist) {
			if ( wishlist ) { 
				wishlist.$remove();

				for (var i in $scope.wishlists) {
					if ($scope.wishlists [i] === wishlist) {
						$scope.wishlists.splice(i, 1);
					}
				}
			} else {
				$scope.wishlist.$remove(function() {
					$location.path('wishlists');
				});
			}
		};

		// Update existing Wishlist
		$scope.update = function() {
			var wishlist = $scope.wishlist;

			wishlist.$update(function() {
				$location.path('wishlists/' + wishlist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wishlists
		$scope.find = function() {
			$scope.wishlists = Wishlists.query();
		};

		// Find existing Wishlist
		$scope.findOne = function() {
			$scope.wishlist = Wishlists.get({ 
				wishlistId: $stateParams.wishlistId
			});
		};
	}
]);