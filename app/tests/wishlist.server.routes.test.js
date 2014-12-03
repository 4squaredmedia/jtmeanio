'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wishlist = mongoose.model('Wishlist'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, wishlist;

/**
 * Wishlist routes tests
 */
describe('Wishlist CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Wishlist
		user.save(function() {
			wishlist = {
				name: 'Wishlist Name'
			};

			done();
		});
	});

	it('should be able to save Wishlist instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wishlist
				agent.post('/wishlists')
					.send(wishlist)
					.expect(200)
					.end(function(wishlistSaveErr, wishlistSaveRes) {
						// Handle Wishlist save error
						if (wishlistSaveErr) done(wishlistSaveErr);

						// Get a list of Wishlists
						agent.get('/wishlists')
							.end(function(wishlistsGetErr, wishlistsGetRes) {
								// Handle Wishlist save error
								if (wishlistsGetErr) done(wishlistsGetErr);

								// Get Wishlists list
								var wishlists = wishlistsGetRes.body;

								// Set assertions
								(wishlists[0].user._id).should.equal(userId);
								(wishlists[0].name).should.match('Wishlist Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Wishlist instance if not logged in', function(done) {
		agent.post('/wishlists')
			.send(wishlist)
			.expect(401)
			.end(function(wishlistSaveErr, wishlistSaveRes) {
				// Call the assertion callback
				done(wishlistSaveErr);
			});
	});

	it('should not be able to save Wishlist instance if no name is provided', function(done) {
		// Invalidate name field
		wishlist.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wishlist
				agent.post('/wishlists')
					.send(wishlist)
					.expect(400)
					.end(function(wishlistSaveErr, wishlistSaveRes) {
						// Set message assertion
						(wishlistSaveRes.body.message).should.match('Please fill Wishlist name');
						
						// Handle Wishlist save error
						done(wishlistSaveErr);
					});
			});
	});

	it('should be able to update Wishlist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wishlist
				agent.post('/wishlists')
					.send(wishlist)
					.expect(200)
					.end(function(wishlistSaveErr, wishlistSaveRes) {
						// Handle Wishlist save error
						if (wishlistSaveErr) done(wishlistSaveErr);

						// Update Wishlist name
						wishlist.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wishlist
						agent.put('/wishlists/' + wishlistSaveRes.body._id)
							.send(wishlist)
							.expect(200)
							.end(function(wishlistUpdateErr, wishlistUpdateRes) {
								// Handle Wishlist update error
								if (wishlistUpdateErr) done(wishlistUpdateErr);

								// Set assertions
								(wishlistUpdateRes.body._id).should.equal(wishlistSaveRes.body._id);
								(wishlistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Wishlists if not signed in', function(done) {
		// Create new Wishlist model instance
		var wishlistObj = new Wishlist(wishlist);

		// Save the Wishlist
		wishlistObj.save(function() {
			// Request Wishlists
			request(app).get('/wishlists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Wishlist if not signed in', function(done) {
		// Create new Wishlist model instance
		var wishlistObj = new Wishlist(wishlist);

		// Save the Wishlist
		wishlistObj.save(function() {
			request(app).get('/wishlists/' + wishlistObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', wishlist.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Wishlist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wishlist
				agent.post('/wishlists')
					.send(wishlist)
					.expect(200)
					.end(function(wishlistSaveErr, wishlistSaveRes) {
						// Handle Wishlist save error
						if (wishlistSaveErr) done(wishlistSaveErr);

						// Delete existing Wishlist
						agent.delete('/wishlists/' + wishlistSaveRes.body._id)
							.send(wishlist)
							.expect(200)
							.end(function(wishlistDeleteErr, wishlistDeleteRes) {
								// Handle Wishlist error error
								if (wishlistDeleteErr) done(wishlistDeleteErr);

								// Set assertions
								(wishlistDeleteRes.body._id).should.equal(wishlistSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Wishlist instance if not signed in', function(done) {
		// Set Wishlist user 
		wishlist.user = user;

		// Create new Wishlist model instance
		var wishlistObj = new Wishlist(wishlist);

		// Save the Wishlist
		wishlistObj.save(function() {
			// Try deleting Wishlist
			request(app).delete('/wishlists/' + wishlistObj._id)
			.expect(401)
			.end(function(wishlistDeleteErr, wishlistDeleteRes) {
				// Set message assertion
				(wishlistDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wishlist error error
				done(wishlistDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Wishlist.remove().exec();
		done();
	});
});