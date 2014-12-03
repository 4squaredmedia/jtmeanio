'use strict';

(function() {
	// Wishlists Controller Spec
	describe('Wishlists Controller Tests', function() {
		// Initialize global variables
		var WishlistsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Wishlists controller.
			WishlistsController = $controller('WishlistsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Wishlist object fetched from XHR', inject(function(Wishlists) {
			// Create sample Wishlist using the Wishlists service
			var sampleWishlist = new Wishlists({
				name: 'New Wishlist'
			});

			// Create a sample Wishlists array that includes the new Wishlist
			var sampleWishlists = [sampleWishlist];

			// Set GET response
			$httpBackend.expectGET('wishlists').respond(sampleWishlists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wishlists).toEqualData(sampleWishlists);
		}));

		it('$scope.findOne() should create an array with one Wishlist object fetched from XHR using a wishlistId URL parameter', inject(function(Wishlists) {
			// Define a sample Wishlist object
			var sampleWishlist = new Wishlists({
				name: 'New Wishlist'
			});

			// Set the URL parameter
			$stateParams.wishlistId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/wishlists\/([0-9a-fA-F]{24})$/).respond(sampleWishlist);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wishlist).toEqualData(sampleWishlist);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Wishlists) {
			// Create a sample Wishlist object
			var sampleWishlistPostData = new Wishlists({
				name: 'New Wishlist'
			});

			// Create a sample Wishlist response
			var sampleWishlistResponse = new Wishlists({
				_id: '525cf20451979dea2c000001',
				name: 'New Wishlist'
			});

			// Fixture mock form input values
			scope.name = 'New Wishlist';

			// Set POST response
			$httpBackend.expectPOST('wishlists', sampleWishlistPostData).respond(sampleWishlistResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Wishlist was created
			expect($location.path()).toBe('/wishlists/' + sampleWishlistResponse._id);
		}));

		it('$scope.update() should update a valid Wishlist', inject(function(Wishlists) {
			// Define a sample Wishlist put data
			var sampleWishlistPutData = new Wishlists({
				_id: '525cf20451979dea2c000001',
				name: 'New Wishlist'
			});

			// Mock Wishlist in scope
			scope.wishlist = sampleWishlistPutData;

			// Set PUT response
			$httpBackend.expectPUT(/wishlists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/wishlists/' + sampleWishlistPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid wishlistId and remove the Wishlist from the scope', inject(function(Wishlists) {
			// Create new Wishlist object
			var sampleWishlist = new Wishlists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Wishlists array and include the Wishlist
			scope.wishlists = [sampleWishlist];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/wishlists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWishlist);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.wishlists.length).toBe(0);
		}));
	});
}());